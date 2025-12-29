# SkyCRM

A modern, high-performance CRM built for speed and aesthetics. Designed with a focus on visual clarity, SkyCRM helps small teams manage relationships, pipelines, and tasks without the clutter.



## 🚀 Features

-   **Pipeline Management**: Drag-and-drop Kanban board with custom stages.
-   **Lead Tracking**: Detailed lead profiles with activity history and value tracking.
-   **Task Management**: Integrated task lists linked to leads.
-   **Analytics**: Real-time dashboard with pipeline value, conversion rates, and activity metrics.
-   **Import/Export**: Smart CSV import with field mapping and duplicate detection.
-   **Team Workspaces**: Collaborate with your team in shared workspaces.
-   **Dark Mode**: Sleek, glassmorphism-inspired dark UI.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime)
-   **State Management**: React Context + Hooks
-   **Routing**: React Router DOM

## 🏁 Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   A Supabase account

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/skycrm.git
    cd skycrm
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**

    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup (Supabase)**

    You will need to set up the following tables in your Supabase project. SQL definitions can be found in `supabase/schema.sql` (if available) or create them manually:

    -   `profiles` (extends auth.users)
    -   `workspaces`
    -   `workspace_members`
    -   `leads`
    -   `tasks`
    -   `activities`
    -   `saved_lists`
    -   `saved_list_leads`

    *Note: Ensure Row Level Security (RLS) policies are enabled to secure data access.*

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

The artifacts will be in the `dist` folder.

## � Deployment

### Option 1: Vercel (Recommended)

1.  Create a [Vercel account](https://vercel.com/signup).
2.  Install Vercel CLI: `npm i -g vercel` (optional, can also use web UI).
3.  **Web UI Method**:
    -   Push your code to a GitHub repository.
    -   Go to Vercel Dashboard -> "Add New..." -> "Project".
    -   Import your `SkyCRM` repository.
    -   **Environment Variables**:
        -   Expand the "Environment Variables" section.
        -   Add `VITE_SUPABASE_URL` and your value.
        -   Add `VITE_SUPABASE_ANON_KEY` and your value.
    -   Click "Deploy".

### Option 2: Netlify

1.  Create a [Netlify account](https://www.netlify.com/signup).
2.  **Web UI Method**:
    -   Push your code to GitHub.
    -   Go to Netlify Dashboard -> "Add new site" -> "Import from existing project".
    -   Select GitHub and choose your repo.
    -   **Build Settings**:
        -   Build command: `npm run build`
        -   Publish directory: `dist`
    -   **Environment Variables**:
        -   Go to "Site settings" -> "Environment variables".
        -   Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
    -   Click "Deploy Site".

### ⚠️ Important Note on Redirects (SPA)

For Single Page Applications (like this React app) to work correctly on refresh (e.g., refreshing `/dashboard` doesn't give a 404), you need a rewrite rule.

**For Vercel**: Create a `vercel.json` file in the root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**For Netlify**: Create a `_redirects` file in the `public` folder:
```text
/*  /index.html  200
```

## �📄 License

This project is licensed under the MIT License.
