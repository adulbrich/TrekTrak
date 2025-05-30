SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."ActivityTypes" AS ENUM (
    'Steps',
    'Distance'
);


ALTER TYPE "public"."ActivityTypes" OWNER TO "postgres";


CREATE TYPE "public"."activitytypes" AS ENUM (
    'Steps',
    'Distance'
);


ALTER TYPE "public"."activitytypes" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public."Profiles"("ProfileID", "Name", "Email")
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'New User'),
    new.email
  );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_progress_func"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$declare
  progress INTEGER;
  rewards INTEGER := 0;
  event_ID uuid;
  event_Row "Events"%ROWTYPE;
  event_type TEXT;
  tier TEXT;
begin
  SELECT "BelongsToEventID"
  INTO event_ID
  FROM "Teams"
  WHERE "TeamID" = NEW."BelongsToTeamID";
  
  SELECT *
  INTO event_Row
  FROM "Events"
  WHERE "EventID" = event_ID;

  progress := NEW."RawProgress";
  event_type := NEW."ActivityType";

  FOREACH tier in ARRAY event_Row."Achievements"
  LOOP
    IF event_type = 'Steps' THEN
      IF progress::numeric >= tier::numeric THEN
        rewards := rewards + 1;
      END IF;
    ELSIF event_type = 'Distance' THEN
      IF progress::numeric >= ((tier::numeric) * 100) THEN
        rewards := rewards + 1;
      END IF;
    END IF;
  END LOOP;

  UPDATE "TeamsProfiles"
  SET "RewardCount" = "RewardCount" + rewards
  WHERE "ProfileID" = NEW."CreatedByProfileID" AND "TeamID" = NEW."BelongsToTeamID";

  RETURN NEW;

end;$$;


ALTER FUNCTION "public"."insert_progress_func"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_progress_func"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$declare
  oldProgress INTEGER;
  newProgress INTEGER;
  oldRewards INTEGER := 0;
  newRewards INTEGER := 0;
  rewards INTEGER := 0;
  event_ID uuid;
  event_Row "Events"%ROWTYPE;
  event_type TEXT;
  tier TEXT;
begin
  SELECT "BelongsToEventID"
  INTO event_ID
  FROM "Teams"
  WHERE "TeamID" = NEW."BelongsToTeamID";
  
  SELECT *
  INTO event_Row
  FROM "Events"
  WHERE "EventID" = event_ID;

  newProgress := NEW."RawProgress";
  oldProgress := OLD."RawProgress";
  event_type := NEW."ActivityType";

  FOREACH tier in ARRAY event_Row."Achievements"
  LOOP
    IF event_type = 'Steps' THEN
      IF newProgress::numeric >= tier::numeric THEN
        newRewards := newRewards + 1;
      END IF;
      IF oldProgress::numeric >= tier::numeric THEN
        oldRewards := oldRewards + 1;
      END IF;
    ELSIF event_type = 'Distance' THEN
      IF newProgress::numeric >= ((tier::numeric) * 100) THEN
        newRewards := newRewards + 1;
      END IF;
      IF oldProgress::numeric >= ((tier::numeric) * 100) THEN
        oldRewards := oldRewards + 1;
      END IF;
    END IF;
  END LOOP;

  rewards := newRewards - oldRewards;

  UPDATE "TeamsProfiles"
  SET "RewardCount" = "RewardCount" + rewards
  WHERE "ProfileID" = NEW."CreatedByProfileID" AND "TeamID" = NEW."BelongsToTeamID";

  RETURN NEW;

end;$$;


ALTER FUNCTION "public"."update_progress_func"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_team_rewards_func"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$declare
  total_rewards INTEGER;
begin
  SELECT SUM("RewardCount")
  INTO total_rewards
  FROM "TeamsProfiles"
  WHERE "TeamID" = New."TeamID";

  UPDATE "Teams"
  SET "RewardCount" = total_rewards
  WHERE "TeamID" = NEW."TeamID";

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."update_team_rewards_func"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ActivityProgress" (
    "ActivityProgressID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "RawProgress" bigint DEFAULT '0'::bigint,
    "CreatedByProfileID" "uuid" NOT NULL,
    "BelongsToTeamID" "uuid" NOT NULL,
    "ActivityType" "public"."activitytypes" NOT NULL
);


ALTER TABLE "public"."ActivityProgress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Events" (
    "EventID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "Name" "text" NOT NULL,
    "Type" "public"."ActivityTypes" NOT NULL,
    "CreatedByUserID" "uuid" NOT NULL,
    "StartsAt" timestamp with time zone NOT NULL,
    "EndsAt" timestamp with time zone NOT NULL,
    "Description" "text" DEFAULT ''::"text",
    "RewardPlural" "text" DEFAULT 'Leaves'::"text" NOT NULL,
    "RewardSingular" "text" DEFAULT 'Leaf'::"text" NOT NULL,
    "RewardTierOneThreshold" integer DEFAULT 2000 NOT NULL,
    "RewardTierThreeThreshold" integer DEFAULT 7000 NOT NULL,
    "RewardTierTwoThreshold" integer DEFAULT 4000 NOT NULL,
    "Achievements" "text"[],
    "AchievementCount" integer DEFAULT 0
);


ALTER TABLE "public"."Events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Teams" (
    "TeamID" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "Name" "text" NOT NULL,
    "BelongsToEventID" "uuid",
    "RewardCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."Teams" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."TeamStats" AS
 SELECT "Teams"."TeamID",
    "Teams"."Name",
    "Teams"."BelongsToEventID",
    ( SELECT "sum"(
                CASE
                    WHEN ("ap"."ActivityType" = 'Steps'::"public"."activitytypes") THEN "ap"."RawProgress"
                    WHEN ("ap"."ActivityType" = 'Distance'::"public"."activitytypes") THEN ("ap"."RawProgress" * 2500)
                    ELSE NULL::bigint
                END) AS "sum"
           FROM "public"."ActivityProgress" "ap"
          WHERE ("Teams"."TeamID" = "ap"."BelongsToTeamID")) AS "TotalScore"
   FROM "public"."Teams";


ALTER TABLE "public"."TeamStats" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."EventStats" AS
 SELECT "Events"."EventID",
    "Events"."Name",
    ( SELECT "sum"("ts"."TotalScore") AS "sum"
           FROM "public"."TeamStats" "ts"
          WHERE ("Events"."EventID" = "ts"."BelongsToEventID")) AS "TotalScore"
   FROM "public"."Events";


ALTER TABLE "public"."EventStats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Organizations" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "org_name" "text" DEFAULT 'unnamed_org'::"text",
    "description" "text"
);


ALTER TABLE "public"."Organizations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Profiles" (
    "ProfileID" "uuid" NOT NULL,
    "CreatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "UpdatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "Name" "text",
    "Role" "text" DEFAULT 'participant'::"text",
    "Organization" "text",
    "Email" "text"
);


ALTER TABLE "public"."Profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."Profiles"."Role" IS 'developer (website developers), admin (within organization), participant (within organization)';



COMMENT ON COLUMN "public"."Profiles"."Organization" IS 'organization a user is in (can be NULL for developers)';



CREATE OR REPLACE VIEW "public"."ProfileStats" AS
 SELECT "Profiles"."ProfileID",
    "Profiles"."Name"
   FROM "public"."Profiles";


ALTER TABLE "public"."ProfileStats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."TeamsProfiles" (
    "TeamID" "uuid" NOT NULL,
    "ProfileID" "uuid" NOT NULL,
    "RewardCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."TeamsProfiles" OWNER TO "postgres";


ALTER TABLE "public"."Organizations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."organization_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."ActivityProgress"
    ADD CONSTRAINT "ActivityProgress_pkey" PRIMARY KEY ("ActivityProgressID");



ALTER TABLE ONLY "public"."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY ("EventID");



ALTER TABLE ONLY "public"."Profiles"
    ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY ("ProfileID");



ALTER TABLE ONLY "public"."TeamsProfiles"
    ADD CONSTRAINT "TeamsProfiles_pkey" PRIMARY KEY ("TeamID", "ProfileID");



ALTER TABLE ONLY "public"."Teams"
    ADD CONSTRAINT "Teams_pkey" PRIMARY KEY ("TeamID");



ALTER TABLE ONLY "public"."Organizations"
    ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "insert_progress_trigger" AFTER INSERT ON "public"."ActivityProgress" FOR EACH ROW EXECUTE FUNCTION "public"."insert_progress_func"();



CREATE OR REPLACE TRIGGER "update_progress_trigger" AFTER UPDATE ON "public"."ActivityProgress" FOR EACH ROW EXECUTE FUNCTION "public"."update_progress_func"();



CREATE OR REPLACE TRIGGER "update_team_rewards_trigger" AFTER UPDATE ON "public"."TeamsProfiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_team_rewards_func"();



ALTER TABLE ONLY "public"."ActivityProgress"
    ADD CONSTRAINT "ActivityProgress_BelongsToTeamID_fkey" FOREIGN KEY ("BelongsToTeamID") REFERENCES "public"."Teams"("TeamID");



ALTER TABLE ONLY "public"."ActivityProgress"
    ADD CONSTRAINT "ActivityProgress_CreatedByProfileID_fkey" FOREIGN KEY ("CreatedByProfileID") REFERENCES "public"."Profiles"("ProfileID");



ALTER TABLE ONLY "public"."Events"
    ADD CONSTRAINT "Events_CreatedByUserID_fkey" FOREIGN KEY ("CreatedByUserID") REFERENCES "public"."Profiles"("ProfileID");



ALTER TABLE ONLY "public"."Profiles"
    ADD CONSTRAINT "Profiles_ProfileID_fkey" FOREIGN KEY ("ProfileID") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."TeamsProfiles"
    ADD CONSTRAINT "TeamsProfiles_ProfileID_fkey" FOREIGN KEY ("ProfileID") REFERENCES "public"."Profiles"("ProfileID");



ALTER TABLE ONLY "public"."TeamsProfiles"
    ADD CONSTRAINT "TeamsProfiles_TeamID_fkey" FOREIGN KEY ("TeamID") REFERENCES "public"."Teams"("TeamID");



ALTER TABLE ONLY "public"."Teams"
    ADD CONSTRAINT "Teams_BelongsToEventID_fkey" FOREIGN KEY ("BelongsToEventID") REFERENCES "public"."Events"("EventID") ON UPDATE CASCADE ON DELETE SET NULL;



CREATE POLICY "Enable delete for users based on user_id" ON "public"."Events" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."Events" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."Organizations" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."Teams" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."TeamsProfiles" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for update users only" ON "public"."Profiles" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."Profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "ProfileID"));



CREATE POLICY "Enable read access for all users" ON "public"."Events" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Organizations" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Teams" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."TeamsProfiles" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."Events" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."Profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "ProfileID"));



ALTER TABLE "public"."Events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow update from all users (TEMP)" ON "public"."TeamsProfiles" FOR UPDATE USING (true);



CREATE POLICY "allow update on teams (TEMP)" ON "public"."Teams" FOR UPDATE USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_progress_func"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_progress_func"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_progress_func"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_progress_func"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_progress_func"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_progress_func"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_team_rewards_func"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_team_rewards_func"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_team_rewards_func"() TO "service_role";



GRANT ALL ON TABLE "public"."ActivityProgress" TO "anon";
GRANT ALL ON TABLE "public"."ActivityProgress" TO "authenticated";
GRANT ALL ON TABLE "public"."ActivityProgress" TO "service_role";



GRANT ALL ON TABLE "public"."Events" TO "anon";
GRANT ALL ON TABLE "public"."Events" TO "authenticated";
GRANT ALL ON TABLE "public"."Events" TO "service_role";



GRANT ALL ON TABLE "public"."Teams" TO "anon";
GRANT ALL ON TABLE "public"."Teams" TO "authenticated";
GRANT ALL ON TABLE "public"."Teams" TO "service_role";



GRANT ALL ON TABLE "public"."TeamStats" TO "anon";
GRANT ALL ON TABLE "public"."TeamStats" TO "authenticated";
GRANT ALL ON TABLE "public"."TeamStats" TO "service_role";



GRANT ALL ON TABLE "public"."EventStats" TO "anon";
GRANT ALL ON TABLE "public"."EventStats" TO "authenticated";
GRANT ALL ON TABLE "public"."EventStats" TO "service_role";



GRANT ALL ON TABLE "public"."Organizations" TO "anon";
GRANT ALL ON TABLE "public"."Organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."Organizations" TO "service_role";



GRANT ALL ON TABLE "public"."Profiles" TO "anon";
GRANT ALL ON TABLE "public"."Profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."Profiles" TO "service_role";



GRANT ALL ON TABLE "public"."ProfileStats" TO "anon";
GRANT ALL ON TABLE "public"."ProfileStats" TO "authenticated";
GRANT ALL ON TABLE "public"."ProfileStats" TO "service_role";



GRANT ALL ON TABLE "public"."TeamsProfiles" TO "anon";
GRANT ALL ON TABLE "public"."TeamsProfiles" TO "authenticated";
GRANT ALL ON TABLE "public"."TeamsProfiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."organization_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."organization_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."organization_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
