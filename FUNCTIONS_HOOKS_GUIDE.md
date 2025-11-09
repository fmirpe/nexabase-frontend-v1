# 📚 Edge Functions & Hooks - User Guide

## 🚀 Quick Start

### What are Edge Functions?

Edge Functions are serverless JavaScript functions that run on-demand in your Nexabase application. They're perfect for:

- Creating custom API endpoints
- Processing data before saving
- Integrating with external services
- Sending emails and notifications
- Running scheduled tasks

### What are Database Hooks?

Hooks are event listeners that automatically execute code when database operations occur. Use them for:

- **Validations**: Check data before saving
- **Transformations**: Normalize or enrich data
- **Auditing**: Log changes automatically
- **Notifications**: Alert users of changes
- **Cascade operations**: Update related records

---

## 🎯 Creating Your First Function

### 1. Via Dashboard

1. Navigate to **Functions** in the sidebar
2. Click **"New Function"**
3. Fill in the details:
   - **Name**: `my-first-function`
   - **Description**: What it does
   - **Trigger**: HTTP, Schedule, etc.
4. Write your code in the editor
5. Click **"Create"**

### 2. Function Template

export default async function handler(context) {
  const { body, query, headers, user, env } = context;

  // Your logic here
  console.log('Function invoked by:', user?.email);

  return {
    success: true,
    message: 'Hello from Edge Function',
    data: body
  };
}

### 3. Test Your Function

1. Click the **"Test"** button on your function card
2. Enter test data in the **Body** tab
3. Add query parameters or headers if needed
4. Click **"Run Function"**
5. View the output and logs

---

## 🪝 Creating Database Hooks

### 1. Via Dashboard

1. Navigate to **Hooks** in the sidebar
2. Click **"New Hook"**
3. Configure:
   - **Name**: `validate-user-email`
   - **Trigger**: `Before Create`
   - **Collections**: `users` (or leave empty for all)
   - **Priority**: Higher = runs first
   - **Async**: Check if non-blocking

### 2. Hook Example

export default async function handler(context) {
  const { body, query, headers, user, env } = context;

  // Your logic here
  console.log('Function invoked by:', user?.email);

  return {
    success: true,
    message: 'Hello from Edge Function',
    data: body
  };
}

### 3. Test Your Function

1. Click the **"Test"** button on your function card
2. Enter test data in the **Body** tab
3. Add query parameters or headers if needed
4. Click **"Run Function"**
5. View the output and logs

---

## 🪝 Creating Database Hooks

### 1. Via Dashboard

1. Navigate to **Hooks** in the sidebar
2. Click **"New Hook"**
3. Configure:
   - **Name**: `validate-user-email`
   - **Trigger**: `Before Create`
   - **Collections**: `users` (or leave empty for all)
   - **Priority**: Higher = runs first
   - **Async**: Check if non-blocking

### 2. Hook Example

async function execute(context) {
  const { data, collection } = context;

  // Validate email
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Transform to lowercase
  data.email = data.email.toLowerCase();

  console.log('✅ Email validated and normalized');

  return context;
}

---

## 📖 Available Triggers

### Function Triggers

- **HTTP**: Invoked via API endpoint
- **Schedule**: Runs on cron schedule
- **Database**: Triggered by DB events
- **Webhook**: Called by external services
- **Manual**: Run manually from dashboard

### Hook Triggers

- **Before Create**: Before inserting record
- **After Create**: After record inserted
- **Before Update**: Before updating record
- **After Update**: After record updated
- **Before Delete**: Before deleting record
- **After Delete**: After record deleted

---

## 🔧 Context Object Reference

### For Functions

{
  body: any, // Request body data
  headers: object, // HTTP headers
  query: object, // Query parameters
  env: object, // Environment variables
  user: object, // Authenticated user
  tenantId: string, // Current tenant
  requestId: string // Unique request ID
}

### For Hooks

{
  trigger: string, // Hook trigger type
  collection: string, // Collection name
  data: object, // Record data (modifiable)
  previousData: object, // Old data (for updates)
  result: object, // Result (after hooks)
  user: object, // Who triggered it
  tenantId: string // Current tenant
}

---

## ⚡ Best Practices

### Functions

✅ **DO:**
- Keep functions small and focused
- Use environment variables for secrets
- Add proper error handling
- Log important events
- Set appropriate timeouts

❌ **DON'T:**
- Store sensitive data in code
- Make infinite loops
- Ignore errors silently
- Use blocking operations
- Exceed memory limits

### Hooks

✅ **DO:**
- Use `before:*` hooks for validation
- Use `after:*` hooks for notifications
- Set appropriate priorities
- Make async hooks non-critical
- Test thoroughly before deploying

❌ **DON'T:**
- Throw errors in async hooks
- Modify data in after hooks
- Create infinite loops with hooks
- Do heavy computation in sync hooks

---

## 🐛 Debugging

### View Logs

1. Click on a function or hook
2. Go to **"Execution History"**
3. Click on an execution to see details
4. View logs, input, output, and errors

### Common Issues

**Function times out:**
- Increase timeout in configuration
- Optimize your code
- Use async operations properly

**Hook prevents save:**
- Check validation logic
- Review error messages in logs
- Test with sample data first

**Permission denied:**
- Verify API key has correct permissions
- Check tenant access
- Ensure user is authenticated

---

## 📊 Monitoring

### Metrics Available

- Total invocations
- Error rate
- Average execution time
- Memory usage
- Last execution time

### Performance Tips

- Monitor execution time regularly
- Set up alerts for errors
- Use async hooks for non-critical tasks
- Optimize database queries
- Cache frequently used data

---

## 🔐 Security

### Environment Variables

Store secrets in environment variables:

1. Go to function configuration
2. Click **"Advanced Configuration"**
3. Add environment variables
4. Access via `context.env.YOUR_VAR`

### API Keys

- Never hardcode API keys in code
- Use environment variables
- Rotate keys regularly
- Limit key permissions

---

## 💡 Examples

See the `user-functions/examples/` directory for:

- HTTP endpoints
- Email sending
- Image processing
- Data validation
- Scheduled reports
- Database triggers
- External API integration

---

## 🆘 Support

Need help?

- 📖 Check our documentation
- 💬 Join our community forum
- 📧 Contact soporte@nexabase.online
- 🐛 Report bugs on GitHub

---

**Happy coding! 🎉**
