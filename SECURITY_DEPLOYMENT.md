# Security deployment requirements

JWT_SECRET must be a securely generated secret with at least 32 characters. Missing, short and known-placeholder signing keys are rejected. Configure the secret in the deployment before merging. Existing sessions signed with the public fallback must be considered untrusted. Wallet signature replay protection is a separate unresolved issue.

Regression tests run in the security workflow. Full application builds and deployed configuration must be verified before merging. No secrets are committed by this change.
