# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Hardening Features

SkillGap-to-Action implements multi-layered security controls:

1. **HTTP Security Headers**: Strict Content-Security-Policy (CSP), X-Content-Type-Options (nosniff), X-Frame-Options (DENY), X-XSS-Protection, and HTTP Strict Transport Security (HSTS).
2. **Brute Force & Rate Limiting Defense**: In-memory sliding-window rate limiters protecting authentication endpoints (`/api/auth/*`) and general API surfaces.
3. **NoSQL Injection & XSS Sanitization**: Recursive deep sanitization stripping MongoDB query operator injection keys (`$where`, `$gt`, `$regex`) and active script tags from all request bodies, queries, and params.
4. **Credential Security**: Bcrypt password hashing (10 salt rounds), strong password complexity policy enforcement, and automatic stripping of password hashes from JSON serialization outputs.
5. **State & Token Isolation**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 and verified through bearer authorization middleware.

## Reporting a Vulnerability

If you discover a security vulnerability within SkillGap-to-Action:
1. Please do not disclose vulnerabilities publicly.
2. Email findings to security@skillgap.dev with step-by-step reproduction instructions.
3. Vulnerabilities will be validated and patched within 48 hours.
