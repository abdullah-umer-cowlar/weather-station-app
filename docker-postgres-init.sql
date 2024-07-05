CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

INSERT INTO users (id, email, password) VALUES
  ('ad6631ea-9b0d-4e33-bd5f-940b6f0dd6c2', 'abdullah@gmail.com', '$2a$10$ZBN3l1gIVMiVN8KxCGev6.5fJcMNmfBdOpeh2oRBpOZABytcbPaLy'),
  ('e5b09172-3baf-4f3a-bd2e-cf51436dfad5', 'john@gmail.com', '$2a$10$2Mbpq4I4Q68cBGm5pakm.eHeIWZ/XyNZzpb0U/fBk98ESNIjUth3O');