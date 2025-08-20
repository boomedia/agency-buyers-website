# User Management Collections

This document covers the user and access management collections: Users, BuyersAccess, and AccessToken.

## Users Collection

### Overview
The Users collection manages system administrators and agents who have full access to the CMS.

### Key Features
- **Authentication**: Built-in email/password authentication
- **Admin Access**: Full CRUD permissions across all collections
- **Auto-Population**: Agent names auto-filled in property notes

### Structure
- **Email**: User email address (required, unique)
- **Password**: Hashed password for authentication
- **Name**: Display name for the user
- **Timestamps**: Created and updated dates (automatic)

### Access Control
- **Admin Panel**: Full access to all features
- **Collections**: Complete CRUD operations
- **Media**: Upload and manage files
- **Settings**: Global configuration access

### Authentication Features
- **Local Strategy**: Email and password authentication
- **Session Management**: Secure session handling
- **Password Reset**: Email-based password recovery
- **Role-based Access**: Admin-level permissions

### Usage in System
- **Agent Notes**: User names auto-populate in property agent notes
- **Content Creation**: Tracks who created/modified content
- **Audit Trail**: User actions are logged for security

## BuyersAccess Collection

### Overview
BuyersAccess is a specialized collection for buyer accounts with limited access to view their property portfolios.

### Key Features
- **Separate Authentication**: Independent from main Users system
- **Property Portfolios**: Each buyer can access specific properties
- **Relationship Sync**: Automatic bidirectional relationship management
- **Limited Scope**: Read-only access to assigned properties

### Structure
- **Email**: Buyer email address (required, unique)
- **Name**: Buyer display name
- **Properties**: Many-to-many relationship with Properties collection

### Access Control
- **Authentication**: Built-in auth system separate from Users
- **Scope**: Access only to assigned properties
- **Read-Only**: Cannot modify property information
- **No Admin**: No access to admin panel or other collections

### Relationship Management
The system automatically maintains relationships between buyers and properties:

#### When Property is Updated
1. System compares current linkedBuyers with previous linkedBuyers
2. Identifies buyers to add and remove
3. Updates BuyersAccess.properties arrays accordingly
4. Maintains data consistency across both collections

#### Bidirectional Sync Process
```txt
Property.linkedBuyers ←→ BuyersAccess.properties
```

### Workflow Examples

#### Adding a Buyer to a Property
1. Admin selects buyer in Property.linkedBuyers
2. System automatically adds property to BuyersAccess.properties
3. Buyer gains access to view the property
4. Relationship is maintained in both directions

#### Removing a Buyer from a Property
1. Admin removes buyer from Property.linkedBuyers
2. System automatically removes property from BuyersAccess.properties
3. Buyer loses access to the property
4. Clean removal from both sides

### Security Features
- **Isolated Access**: Buyers cannot see other buyers' properties
- **No Admin Access**: Cannot access admin panel or modify data
- **Secure Authentication**: Separate auth system prevents cross-access
- **Audit Trail**: All access is logged for security

## AccessToken Collection

### Overview
AccessToken provides API key authentication for programmatic access to the CMS.

### Key Features
- **API Key Authentication**: Alternative to session-based auth
- **Programmatic Access**: For external integrations and automation
- **Named Tokens**: Each token has a descriptive name
- **Secure Storage**: API keys are securely generated and stored

### Structure
- **Name**: Descriptive name for the token (required)
- **API Key**: Generated authentication key (automatic)

### Authentication Strategy
- **API Key Only**: Uses API key header for authentication
- **No Local Strategy**: Disables email/password login
- **Programmatic**: Designed for system-to-system communication

### Usage Scenarios
- **Data Import/Export**: Bulk operations via API
- **External Integrations**: Third-party system connections
- **Automation**: Scheduled tasks and workflows
- **Mobile Apps**: Native application authentication

### Security Considerations
- **Key Rotation**: Regular token regeneration recommended
- **Named Access**: Each integration should have its own token
- **Audit Logging**: API usage is tracked and logged
- **Scope Limitation**: Consider implementing scope-based restrictions

## Authentication Flow

### User Authentication (Admin)
1. **Login**: Email and password at admin panel
2. **Session**: Secure session cookie created
3. **Access**: Full admin panel and API access
4. **Logout**: Session invalidated

### Buyer Authentication
1. **Login**: Email and password at buyer portal
2. **Session**: Limited session for buyer access
3. **Access**: Read-only access to assigned properties only
4. **Logout**: Session invalidated

### API Token Authentication
1. **Header**: Include API key in request headers
2. **Validation**: System validates token against AccessToken collection
3. **Access**: Full API access based on token permissions
4. **Logging**: API calls are logged with token information

## User Management Best Practices

### Admin Users
- **Principle of Least Privilege**: Only create admin accounts when necessary
- **Strong Passwords**: Enforce strong password requirements
- **Regular Review**: Periodically review active admin accounts
- **Offboarding**: Disable accounts when users leave

### Buyer Accounts
- **Email Verification**: Verify buyer email addresses before granting access
- **Property Assignment**: Carefully manage which properties buyers can access
- **Regular Cleanup**: Remove access for expired buyers
- **Communication**: Notify buyers when properties are added/removed

### API Tokens
- **Descriptive Names**: Use clear, descriptive names for each token
- **Limited Scope**: Create tokens for specific purposes
- **Regular Rotation**: Change tokens periodically for security
- **Monitor Usage**: Track API usage and identify suspicious activity

## Integration Points

### With Properties Collection
- **Agent Auto-Population**: User names automatically fill agent note fields
- **Relationship Management**: Automatic buyer-property relationship sync
- **Change Tracking**: User actions tracked for audit purposes

### With Content Collections
- **Author Assignment**: Users can be assigned as content authors
- **Creation Tracking**: User who created content is recorded
- **Modification History**: Changes tracked by user account

### With External Systems
- **API Access**: External systems can use tokens for data access
- **Webhook Notifications**: User actions can trigger external notifications
- **Data Synchronization**: Buyer information can sync with CRM systems

## Security Features

### Password Security
- **Hashing**: Passwords stored with secure hashing
- **Salt**: Unique salt for each password
- **Complexity**: Enforce password strength requirements
- **Reset**: Secure password reset via email

### Session Security
- **HTTPS Only**: Sessions require secure connections
- **Expiration**: Sessions expire after inactivity
- **Cross-Site Protection**: CSRF protection enabled
- **Same-Site Cookies**: Protection against cross-site attacks

### API Security
- **Rate Limiting**: Prevent API abuse
- **Token Validation**: Secure token verification
- **Request Logging**: All API requests logged
- **Error Handling**: Secure error messages without information leakage
