DO $$
DECLARE
  betsson_org uuid := 'b7e15500-0001-4000-8000-000000000001';
  betsson_user uuid := '779d6e26-c27e-4490-97d0-75b2635f204c';
BEGIN
  DELETE FROM ai_credit_transactions WHERE organization_id = betsson_org;
  DELETE FROM ai_usage_logs WHERE organization_id = betsson_org;
  DELETE FROM org_ai_credits WHERE organization_id = betsson_org;
  DELETE FROM alert_feedback WHERE organization_id = betsson_org;
  DELETE FROM reports WHERE organization_id = betsson_org;
  DELETE FROM client_email_recipients WHERE organization_id = betsson_org;
  DELETE FROM sesiones WHERE organization_id = betsson_org;
  DELETE FROM alerts WHERE organization_id = betsson_org;
  DELETE FROM client_users WHERE client_id IN (SELECT id FROM clients WHERE organization_id = betsson_org);
  DELETE FROM clients WHERE organization_id = betsson_org;
  DELETE FROM organizations WHERE id = betsson_org;
  DELETE FROM user_roles WHERE user_id = betsson_user;
  DELETE FROM profiles WHERE id = betsson_user;
  DELETE FROM auth.users WHERE id = betsson_user;
END $$;