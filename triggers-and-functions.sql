CREATE OR REPLACE FUNCTION update_sales_paid_delivered()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Sales"
  SET "paid" = NEW."paid"
  WHERE "ordersId" = NEW."id";

  IF NEW."paid" = true THEN
    UPDATE "Orders"
    SET "delivered" = true
    WHERE "id" = NEW."id";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_paid_update_delivered
AFTER UPDATE ON "Orders"
FOR EACH ROW
WHEN (OLD."paid" IS DISTINCT FROM NEW."paid")
EXECUTE FUNCTION update_sales_paid_delivered();
