# Agency Buyers Website - Payload CMS Documentation

This documentation provides a comprehensive guide to the Payload CMS collections and their structure used in the Agency Buyers Website.

## 📁 Documentation Structure

- **[Overview](./payload-overview.md)** - High-level overview of the CMS setup
- **[Real Estate Collections](./real-estate-collections.md)** - Properties, Regions, and Suburbs
- **[Content Collections](./content-collections.md)** - Pages, Posts, Media, and Categories
- **[User Management](./user-management.md)** - Users, Buyers Access, and Access Tokens
- **[Field Reference](./field-reference.md)** - Detailed field definitions and types
- **[Video URL Support](./video-url-support.md)** - Video embedding from YouTube, Vimeo, and Loom

## 🏗️ Quick Start

The CMS is organized into three main groups:

### Real Estate

- **Properties** - Investment property listings with detailed financial calculations
- **Regions** - Local Government Areas (LGAs) with community information
- **Suburbs** - Suburb data linked to regions with vacancy rates

### Content

- **Pages** - Website pages with flexible block layouts
- **Posts** - Blog posts and articles
- **Media** - File uploads and image management
- **Categories** - Content categorization

### Admin

- **Users** - System administrators and agents
- **Buyers Access** - Buyer accounts with property portfolios
- **Access Tokens** - API authentication tokens

## 🔗 Relationships

The collections are interconnected through various relationships:

```txt
Properties ←→ BuyersAccess (Many-to-Many)
Suburbs → Regions (Many-to-One)
Properties → Suburbs (Many-to-One)
Properties → Regions (Many-to-One, auto-populated)
Posts → Categories (Many-to-Many)
```

## 🚀 Getting Started

1. Review the [Overview](./payload-overview.md) for system architecture
2. Check [Real Estate Collections](./real-estate-collections.md) for property management
3. Explore [Content Collections](./content-collections.md) for website content
4. Reference [Field Reference](./field-reference.md) for detailed field information

## 📝 Notes

- All monetary values are in AUD currency
- The system automatically calculates financial metrics for properties
- SEO fields are available on most content types
- Live preview is enabled for Properties and Pages
