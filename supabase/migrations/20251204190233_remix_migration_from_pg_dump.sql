CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: certificate_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.certificate_status AS ENUM (
    'Valid',
    'Expiring Soon',
    'Expired',
    'In Progress'
);


--
-- Name: certificate_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.certificate_type AS ENUM (
    'CE',
    'FCC',
    'UL',
    'UKCA',
    'CB',
    'EMC',
    'RF',
    'Safety',
    'Eco-design',
    'Other'
);


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    certificate_name text NOT NULL,
    certificate_type public.certificate_type NOT NULL,
    product_name text NOT NULL,
    product_model text,
    country_or_region text NOT NULL,
    regulatory_standard text,
    certification_body text,
    certificate_number text,
    issue_date date NOT NULL,
    expiration_date date,
    status public.certificate_status DEFAULT 'In Progress'::public.certificate_status,
    internal_responsible text,
    internal_notes text,
    certificate_file_url text,
    certificate_file_key text,
    external_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_name text NOT NULL,
    primary_country text,
    industry text,
    contact_person text,
    contact_email text,
    contact_phone text,
    notes text,
    internal_code text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: congress_bill_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.congress_bill_statuses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    congress integer NOT NULL,
    bill_type text NOT NULL,
    bill_number text NOT NULL,
    current_stage text NOT NULL,
    stages jsonb NOT NULL,
    scraped_at timestamp with time zone DEFAULT now() NOT NULL,
    email_updated_at timestamp with time zone,
    has_email_update boolean DEFAULT false
);

ALTER TABLE ONLY public.congress_bill_statuses REPLICA IDENTITY FULL;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: congress_bill_statuses congress_bill_statuses_congress_bill_type_bill_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.congress_bill_statuses
    ADD CONSTRAINT congress_bill_statuses_congress_bill_type_bill_number_key UNIQUE (congress, bill_type, bill_number);


--
-- Name: congress_bill_statuses congress_bill_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.congress_bill_statuses
    ADD CONSTRAINT congress_bill_statuses_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_bill_statuses_email_updates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bill_statuses_email_updates ON public.congress_bill_statuses USING btree (has_email_update, email_updated_at) WHERE (has_email_update = true);


--
-- Name: idx_bill_statuses_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bill_statuses_lookup ON public.congress_bill_statuses USING btree (congress, bill_type, bill_number);


--
-- Name: idx_certificates_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_certificates_client_id ON public.certificates USING btree (client_id);


--
-- Name: idx_certificates_country; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_certificates_country ON public.certificates USING btree (country_or_region);


--
-- Name: idx_certificates_expiration_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_certificates_expiration_date ON public.certificates USING btree (expiration_date);


--
-- Name: idx_certificates_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_certificates_status ON public.certificates USING btree (status);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: certificates update_certificates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: clients update_clients_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: certificates certificates_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: certificates certificates_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: congress_bill_statuses Anyone can read bill statuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read bill statuses" ON public.congress_bill_statuses FOR SELECT USING (true);


--
-- Name: certificates Only admin can delete certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admin can delete certificates" ON public.certificates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: clients Only admin can delete clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admin can delete clients" ON public.clients FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Only admin can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admin can manage roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: certificates Public can insert certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);


--
-- Name: clients Public can insert clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can insert clients" ON public.clients FOR INSERT WITH CHECK (true);


--
-- Name: certificates Public can update certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can update certificates" ON public.certificates FOR UPDATE USING (true);


--
-- Name: clients Public can update clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can update clients" ON public.clients FOR UPDATE USING (true);


--
-- Name: certificates Public can view certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view certificates" ON public.certificates FOR SELECT USING (true);


--
-- Name: clients Public can view clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view clients" ON public.clients FOR SELECT USING (true);


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: certificates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: congress_bill_statuses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.congress_bill_statuses ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


