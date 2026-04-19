# MERai - Development Log

## 1. Initial Product Direction
Initially, I considered building a generic document generator. However, I quickly realized that a broad, generic tool wouldn't fully align with all the requirements of the Meridian company. I needed an MVP that solved a specific, expensive problem. EPC project closeouts are notoriously chaotic and cost companies millions in delayed handovers—this felt like the perfect wedge.
While the CEO saw this as the primary issue, deeper conversations with other employees revealed that the core problem is much deeper and goes back to missing out on important project details.

## 2. Decisions Made
- **The Concept:** MERai became the final concept because it targets the specific operational bottleneck of unstructured project communication (transcripts, emails, change orders) causing 6-month handover delays. 
So its not just document generation, it's also about decision intelligence and project memory. 

## 3. Reversals & Changes
- **Backend Architecture:** I initially planned to wire up a real Python backend with an LLM API. I reversed this decision midway. For a prototype demo, latency and prompt tuning are risks. Hardcoding a highly specific, realistic scenario (the Paradip Green Hydrogen Facility) demonstrates the value proposition much more effectively than a generic RAG pipeline running on random text.
- **The Database:** Cut entirely. Storing data wasn't the goal; demonstrating intelligence was.

## 4. Where AI Helped
- **Fast Scaffolding:** Scaffolded the entire React application and component routing structure in seconds.
- **UI Generation:** Handled the heavy lifting of the CSS (glassmorphism, smooth animations, Recharts integration) effortlessly.
- **Data Contextualization:** Instantly parsed a raw meeting transcript about a Hydrogen facility and mapped it perfectly into the UI's Decision Intelligence and Project Memory modules.

## 5. Where AI Failed / Hallucinated
- **Dependency Versioning:** The AI initially hallucinated the setup for TailwindCSS. It tried to use standard PostCSS configurations, failing to recognize that Tailwind v4 had just been released and moved its PostCSS plugin to a completely different package (`@tailwindcss/postcss`).
- **Build Crash:** This resulted in a broken build and an internal server error on the dev server because the stylesheets couldn't compile.

## 6. How Problems Were Caught
- The Tailwind error was caught immediately upon spinning up the dev server.
- **The Fix:** I didn't have to manually dig through StackOverflow. I simply fed the terminal error log back into the AI. The AI instantly realized the v4 compatibility issue, autonomously uninstalled the broken dependencies, downgraded the project to a stable Tailwind v3.4.1 environment, and fixed the configuration files. It required almost zero manual intervention on my part.

## 7. What Was Cut Due to Time
- **Real File Parsing:** The drag-and-drop zone visually simulates processing rather than actually chunking the PDFs.
- **Authentication:** No login walls; the prototype drops you right into the value.

## 8. What Would Be Built Next
- **Real RAG Pipeline:** Integrating LLM to genuinely parse unstructured EPC dossiers.
- **ERP Integration:** Hooking into SAP or Aconex for automated ground-truth verification against the LLM's findings.
- **Multi-user Workflows:** Role-based dashboards for Project Managers, Clients, and Licensors.

## 9. Reflection
Building MERai reinforced that speed is everything, but polish is what sells the vision. AI eliminates the busywork of boilerplate React, allowing me to spend 90% of my time on product thinking, domain mapping, and UX. The fact that the AI can now hit a build error, read the terminal output, and successfully fix its own environment issues is a massive leverage point for a solo builder. It turns what used to be an hour of debugging into a 30-second automated fix. 

The project itself was very simple, but it helped me understand the potential of AI in software development. My goal was straightforward: a document generator that guides and helps the closeout team; a decision intelligence tool that keeps track of what decision was made, when, how, and by whom to avoid any confusion during decision making; and finally, a project memory where all the important details of the project are stored and can be retrieved easily through a chat bot.
