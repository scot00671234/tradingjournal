# CoinFeedly for Cloudron

This is a Cloudron-ready package for CoinFeedly, a professional trading journal application.

## Features

- **Complete Trading Journal**: Track trades, analyze performance, and improve your trading strategy
- **PostgreSQL Integration**: Uses Cloudron's PostgreSQL addon for data storage
- **Email Integration**: Uses Cloudron's sendmail addon for email notifications
- **Multi-Currency Support**: Track trades in 30+ global currencies
- **Subscription Management**: Integrated Stripe payments for Pro/Elite plans

## Installation

1. **Install on Cloudron**: Upload this package to your Cloudron instance
2. **Configure Database**: PostgreSQL addon is automatically configured
3. **Configure Email**: Sendmail addon is automatically configured
4. **Optional - Configure Stripe**: Add Stripe keys for payment processing
5. **Access Your App**: Visit your assigned domain to start using CoinFeedly

## Environment Variables

The following environment variables can be configured in Cloudron:

### Required (Auto-configured by Cloudron)
- `CLOUDRON_POSTGRESQL_URL` - Database connection (auto-set by PostgreSQL addon)
- `CLOUDRON_MAIL_FROM` - Email sender address (auto-set by sendmail addon)
- `CLOUDRON_APP_ORIGIN` - App domain (auto-set by Cloudron)

### Optional (for enhanced features)
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret for subscription management
- `SENDGRID_API_KEY` - SendGrid API key (alternative to Cloudron sendmail)

## Post-Installation

1. **Create Admin Account**: Visit your app and create the first user account
2. **Configure Payments** (optional): Add Stripe keys in Cloudron environment variables
3. **Customize Settings**: Adjust currency and other preferences in the app

## Subscription Plans

- **Free**: Up to 5 trades
- **Pro ($29/month)**: Unlimited trades, advanced analytics
- **Elite ($49/month)**: All Pro features plus priority support

## Support

- Documentation: [docs.coinfeedly.com](https://docs.coinfeedly.com)
- Support: support@coinfeedly.com
- Cloudron Issues: Report via Cloudron app store

## Technical Details

- **Runtime**: Node.js 20
- **Database**: PostgreSQL (via Cloudron addon)
- **Email**: Sendmail (via Cloudron addon) or SendGrid
- **Memory**: 1GB recommended
- **Storage**: Minimal (database only)

## Building

To build this package for Cloudron:

```bash
# Build the application
npm run build

# Create Cloudron package
cloudron build

# Test locally (optional)
cloudron install --image local/coinfeedly
```