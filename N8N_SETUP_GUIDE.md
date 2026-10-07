# n8n Workflow Setup Guide for Meridian

This guide walks you through creating the n8n workflow that powers Meridian's AI plan generation.

## 📋 Prerequisites

1. **n8n Instance** (self-hosted or n8n.cloud)
2. **Claude API Key** (from Anthropic: https://console.anthropic.com)
3. **Webhook URL** to configure in your `.env` file

---

## 🔧 Workflow Steps

### 1. Create a New Workflow in n8n

1. Log into your n8n instance
2. Click **New Workflow**
3. Name it: `Meridian Plan Generator`
4. Save

### 2. Add a Webhook Trigger

1. Add a node: **Webhook**
2. Configure:
   - **Method:** POST
   - **Path:** `/meridian-plan-generator` (or your preference)
   - **Authentication:** None (or add API key validation later)
3. This creates your webhook URL: `https://your-n8n-instance.com/webhook/meridian-plan-generator`
4. **Copy this URL** — you'll need it for `.env`

### 3. Add HTTP Request to Claude API

1. Add another node: **HTTP Request**
2. Configure:
   - **Method:** POST
   - **URL:** `https://api.anthropic.com/v1/messages`
   - **Authentication:** Header auth (add in next step)
   - **Send Binary Data:** OFF

3. **Headers:**
   - `Content-Type`: `application/json`
   - `x-api-key`: `{{ $env.ANTHROPIC_API_KEY }}` (set as environment variable in n8n)
   - `anthropic-version`: `2023-06-01`

4. **Body** (JSON):
   ```json
   {
     "model": "claude-3-5-sonnet-20241022",
     "max_tokens": 2000,
     "system": "You are Meridian, an empathetic career coach specializing in 90-day career transition plans. Generate warm, actionable, personalized guidance based on intake data. Return a JSON response with the exact structure provided.",
     "messages": [
       {
         "role": "user",
         "content": "Generate a personalized 30/60/90 day career transition plan based on this intake:\n\nTransition reason: {{ $node['Webhook'].json.transition.reason }}\nProfessional background: {{ $node['Webhook'].json.professional.background }}\nDesired priorities: {{ $node['Webhook'].json.nextStep.priorities }}\n90-day win: {{ $node['Webhook'].json.goal.ninetyDayWin }}\n\nReturn JSON with this structure:\n{\n  \"preview\": {\n    \"title\": \"Here's a glimpse of your first 30 days...\",\n    \"message\": \"Your full 90-day plan...\",\n    \"actions\": [{\"title\": \"\", \"description\": \"\"}]\n  },\n  \"thirtyDays\": {\n    \"title\": \"Days 1–30: Stabilize & Clarify\",\n    \"description\": \"\",\n    \"items\": [\"action1\", \"action2\", \"action3\"]\n  },\n  \"sixtyDays\": {\n    \"title\": \"Days 31–60: Build & Connect\",\n    \"description\": \"\",\n    \"items\": [\"action1\", \"action2\", \"action3\"]\n  },\n  \"ninetyDays\": {\n    \"title\": \"Days 61–90: Accelerate & Decide\",\n    \"description\": \"\",\n    \"items\": [\"action1\", \"action2\", \"action3\"]\n  },\n  \"dailyCheckins\": {\n    \"affirmations\": [\"aff1\", \"aff2\", \"aff3\"],\n    \"focusAreas\": [\"focus1\", \"focus2\"]\n  }\n}"
       }
     ]
   }
   ```

### 4. Parse Claude Response

1. Add a **Function** node (or **Code** node)
2. Extract the JSON from Claude's response:

```javascript
// Claude returns { content: [{ type: "text", text: "..." }] }
const response = items[0].json.content[0].text;

// Parse JSON from response (Claude might wrap it in markdown code blocks)
const jsonMatch = response.match(/\{[\s\S]*\}/);
const plan = JSON.parse(jsonMatch[0]);

return {
  json: plan
};
```

### 5. Return Response

1. Add a **Respond to Webhook** node
2. Configure:
   - **Status Code:** 200
   - **Response Body:** `{{ $node['Function'].json }}`

---

## 🔑 Environment Variables in n8n

Set in n8n dashboard (**Settings → Environment Variables**):

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
```

---

## 🧪 Test the Workflow

1. In the webhook node, copy your webhook URL
2. Test with cURL or Postman:

```bash
curl -X POST "https://your-n8n-instance.com/webhook/meridian-plan-generator" \
  -H "Content-Type: application/json" \
  -d '{
    "transition": {
      "reason": ["Layoff"],
      "timeSince": "recently",
      "feeling": "hopeful"
    },
    "professional": {
      "background": "Senior Product Manager, 15 years in tech",
      "industries": ["Technology"],
      "level": "Director/Senior Director"
    },
    "nextStep": {
      "openTo": ["Full-time role (new field)", "Consulting/Fractional"],
      "priorities": ["Flexibility/remote", "Mission/impact", "Learning something new"],
      "avoid": "No corporate politics"
    },
    "energy": {
      "availableTime": "high",
      "networkingComfort": "medium",
      "focus": "searching"
    },
    "goal": {
      "ninetyDayWin": "Land a role that excites me and values my leadership",
      "additionalContext": "Open to adjacent industries"
    },
    "timestamp": "2026-10-07T14:32:00Z"
  }'
```

Expected response:
```json
{
  "preview": { ... },
  "thirtyDays": { ... },
  "sixtyDays": { ... },
  "ninetyDays": { ... },
  "dailyCheckins": { ... }
}
```

---

## 🚀 Deploy to Meridian

1. **Get your webhook URL** from the webhook node
2. In Meridian project root, create `.env`:
   ```
   VITE_MERIDIAN_PLAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/meridian-plan-generator
   ```
3. **Restart dev server:** `npm run dev`
4. **Test the intake flow** — it should now call n8n and generate a real plan

---

## 🔗 n8n Workflow JSON Export

Use this JSON to import directly into n8n (Settings → Import from File):

```json
{
  "nodes": [
    {
      "parameters": {
        "path": "meridian-plan-generator",
        "responseMode": "lastNode",
        "options": {}
      },
      "id": "webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 200]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.anthropic.com/v1/messages",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "x-api-key",
              "value": "={{ $env.ANTHROPIC_API_KEY }}"
            },
            {
              "name": "anthropic-version",
              "value": "2023-06-01"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "",
              "value": "={\"model\": \"claude-3-5-sonnet-20241022\", \"max_tokens\": 2000, \"system\": \"You are Meridian, an empathetic career coach. Generate a 30/60/90 day plan and return valid JSON.\", \"messages\": [{\"role\": \"user\", \"content\": \"Generate a plan for someone with background: {{ $node[\\\"Webhook\\\"].json.professional.background }} and goal: {{ $node[\\\"Webhook\\\"].json.goal.ninetyDayWin }}\"}]}"
            }
          ]
        }
      },
      "id": "claude-api",
      "name": "Claude API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [450, 200]
    },
    {
      "parameters": {
        "functionCode": "const response = items[0].json.content[0].text;\nconst jsonMatch = response.match(/\\{[\\s\\S]*\\}/);\nconst plan = JSON.parse(jsonMatch[0]);\nreturn { json: plan };"
      },
      "id": "parse-response",
      "name": "Parse Response",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [650, 200]
    },
    {
      "parameters": {
        "responseBody": "={{ $node['parse-response'].json }}"
      },
      "id": "respond-webhook",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [850, 200]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "claude-api", "type": "main", "index": 0}]]
    },
    "claude-api": {
      "main": [[{"node": "parse-response", "type": "main", "index": 0}]]
    },
    "parse-response": {
      "main": [[{"node": "respond-webhook", "type": "main", "index": 0}]]
    }
  }
}
```

---

## ✅ Checklist

- [ ] n8n instance ready (self-hosted or cloud)
- [ ] Claude API key obtained from Anthropic
- [ ] Webhook created in n8n
- [ ] Claude HTTP Request configured
- [ ] Environment variable set in n8n
- [ ] Workflow tested with test payload
- [ ] Webhook URL copied
- [ ] `.env` file updated in Meridian project
- [ ] Dev server restarted
- [ ] Full intake flow tested end-to-end

---

## 🐛 Troubleshooting

**Issue: "API request failed"**
- Check webhook URL is correct in `.env`
- Verify n8n workflow is active (green play button)
- Check n8n logs for errors

**Issue: "Timeout after 180 seconds"**
- Claude API might be slow; check n8n execution logs
- Increase max_tokens if response is cut off
- Ensure ANTHROPIC_API_KEY is set in n8n env vars

**Issue: "Invalid JSON response"**
- Claude sometimes returns markdown-wrapped JSON; the parse function handles this
- Check Claude's raw response in n8n logs
- Verify response structure matches expected schema

---

For support, check n8n docs (https://docs.n8n.io) and Anthropic Claude API docs (https://docs.anthropic.com).
