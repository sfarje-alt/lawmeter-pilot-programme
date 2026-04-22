-- Tabla de balance de créditos IA por organización
CREATE TABLE public.org_ai_credits (
  organization_id uuid NOT NULL PRIMARY KEY,
  balance integer NOT NULL DEFAULT 30,
  included_credits integer NOT NULL DEFAULT 30,
  total_consumed integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.org_ai_credits ENABLE ROW LEVEL SECURITY;

-- Solo miembros de la organización pueden ver su balance
CREATE POLICY "Org members can view their credits"
ON public.org_ai_credits
FOR SELECT
USING (organization_id IN (
  SELECT profiles.organization_id FROM profiles WHERE profiles.id = auth.uid()
));

-- Tabla de auditoría de transacciones
CREATE TABLE public.ai_credit_transactions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  user_id uuid,
  delta integer NOT NULL,
  reason text NOT NULL,
  session_external_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view their transactions"
ON public.ai_credit_transactions
FOR SELECT
USING (organization_id IN (
  SELECT profiles.organization_id FROM profiles WHERE profiles.id = auth.uid()
));

CREATE INDEX idx_ai_credit_tx_org ON public.ai_credit_transactions(organization_id, created_at DESC);

-- RPC: consume_credits — descuenta de forma atómica
CREATE OR REPLACE FUNCTION public.consume_ai_credits(
  _organization_id uuid,
  _amount integer,
  _reason text,
  _user_id uuid DEFAULT NULL,
  _session_external_id text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_balance integer;
  _new_balance integer;
BEGIN
  IF _amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_amount');
  END IF;

  -- Crear fila si no existe
  INSERT INTO public.org_ai_credits (organization_id, balance, included_credits)
  VALUES (_organization_id, 30, 30)
  ON CONFLICT (organization_id) DO NOTHING;

  -- Bloquear y leer balance actual
  SELECT balance INTO _current_balance
  FROM public.org_ai_credits
  WHERE organization_id = _organization_id
  FOR UPDATE;

  IF _current_balance < _amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'balance', _current_balance,
      'required', _amount
    );
  END IF;

  _new_balance := _current_balance - _amount;

  UPDATE public.org_ai_credits
  SET balance = _new_balance,
      total_consumed = total_consumed + _amount,
      updated_at = now()
  WHERE organization_id = _organization_id;

  INSERT INTO public.ai_credit_transactions (
    organization_id, user_id, delta, reason, session_external_id, metadata
  ) VALUES (
    _organization_id, _user_id, -_amount, _reason, _session_external_id, _metadata
  );

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', _new_balance,
    'consumed', _amount
  );
END;
$$;

-- Asegurar que la tabla emita realtime
ALTER TABLE public.org_ai_credits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.org_ai_credits;

-- Inicializar balance para organizaciones existentes
INSERT INTO public.org_ai_credits (organization_id, balance, included_credits)
SELECT id, 30, 30 FROM public.organizations
ON CONFLICT (organization_id) DO NOTHING;