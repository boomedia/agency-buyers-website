import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_properties_v_version_info_addr_version_info_addr_suburb_name_idx";
  DROP INDEX "_regions_v_version_infrastructure_future_development_image_idx";
  DROP INDEX "_regions_v_version_infrastructure_future_development_icon_idx";
  ALTER TABLE "regions" ADD COLUMN "slug" varchar;
  ALTER TABLE "_regions_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "suburbs" ADD COLUMN "slug" varchar;
  ALTER TABLE "_suburbs_v" ADD COLUMN "version_slug" varchar;
  CREATE INDEX "_properties_v_version_info_addr_version_info_addr_suburb_idx" ON "_properties_v" USING btree ("version_info_addr_suburb_name_id");
  CREATE UNIQUE INDEX "regions_slug_idx" ON "regions" USING btree ("slug");
  CREATE INDEX "_regions_v_version_infrastructure_future_development_ima_idx" ON "_regions_v_version_infrastructure_future_development" USING btree ("image_id");
  CREATE INDEX "_regions_v_version_infrastructure_future_development_ico_idx" ON "_regions_v_version_infrastructure_future_development" USING btree ("icon_id");
  CREATE INDEX "_regions_v_version_version_slug_idx" ON "_regions_v" USING btree ("version_slug");
  CREATE UNIQUE INDEX "suburbs_slug_idx" ON "suburbs" USING btree ("slug");
  CREATE INDEX "_suburbs_v_version_version_slug_idx" ON "_suburbs_v" USING btree ("version_slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_properties_v_version_info_addr_version_info_addr_suburb_idx";
  DROP INDEX "regions_slug_idx";
  DROP INDEX "_regions_v_version_infrastructure_future_development_ima_idx";
  DROP INDEX "_regions_v_version_infrastructure_future_development_ico_idx";
  DROP INDEX "_regions_v_version_version_slug_idx";
  DROP INDEX "suburbs_slug_idx";
  DROP INDEX "_suburbs_v_version_version_slug_idx";
  CREATE INDEX "_properties_v_version_info_addr_version_info_addr_suburb_name_idx" ON "_properties_v" USING btree ("version_info_addr_suburb_name_id");
  CREATE INDEX "_regions_v_version_infrastructure_future_development_image_idx" ON "_regions_v_version_infrastructure_future_development" USING btree ("image_id");
  CREATE INDEX "_regions_v_version_infrastructure_future_development_icon_idx" ON "_regions_v_version_infrastructure_future_development" USING btree ("icon_id");
  ALTER TABLE "regions" DROP COLUMN "slug";
  ALTER TABLE "_regions_v" DROP COLUMN "version_slug";
  ALTER TABLE "suburbs" DROP COLUMN "slug";
  ALTER TABLE "_suburbs_v" DROP COLUMN "version_slug";`)
}
