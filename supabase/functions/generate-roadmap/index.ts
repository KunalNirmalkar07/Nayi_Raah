import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { careerName, careerStream, matchScore, scores, skills, requiredExams, topColleges } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are a career guidance expert for students in India. Generate a detailed, personalized career roadmap for a student interested in becoming a **${careerName}** (${careerStream} stream, ${matchScore}% match score).

Student's trait scores:
- Analytical: ${scores?.analytical || 'N/A'}
- Creative: ${scores?.creative || 'N/A'}  
- Social: ${scores?.social || 'N/A'}
- Practical: ${scores?.practical || 'N/A'}
- Aptitude Score: ${scores?.aptitudeScore || 'N/A'}%

Known skills to develop: ${skills?.join(', ') || 'N/A'}
Required exams: ${requiredExams?.join(', ') || 'N/A'}
Top colleges: ${topColleges?.map((c: { name: string }) => c.name).join(', ') || 'N/A'}

Generate a comprehensive JSON roadmap with this EXACT structure (no markdown, just raw JSON):
{
  "summary": "A 2-3 sentence personalized summary of why this career suits the student",
  "strengthsAnalysis": ["strength1", "strength2", "strength3"],
  "areasToImprove": ["area1", "area2"],
  "timeline": [
    {
      "phase": "1",
      "title": "Phase title",
      "duration": "Time period",
      "description": "Brief description of this phase",
      "tasks": [
        {"task": "Specific task description", "priority": "high/medium/low", "resources": "Suggested resource or website"},
        {"task": "Another task", "priority": "medium", "resources": "Resource link or name"}
      ],
      "milestones": ["Key milestone 1", "Key milestone 2"],
      "tips": "Pro tip for this phase"
    }
  ],
  "scholarships": [
    {"name": "Scholarship name", "eligibility": "Who can apply", "amount": "Amount or benefit"}
  ],
  "alternativePaths": [
    {"name": "Alternative career", "reason": "Why this could also work"}
  ],
  "monthlyPlan": {
    "month1to3": "What to focus on in first 3 months",
    "month4to6": "Next 3 months focus",
    "month7to12": "Rest of the year"
  }
}

Make the roadmap specific to the Indian context — mention national entrance exams, coaching resources, top colleges (IITs, NITs, AIIMS, BIT, etc.), national scholarships (NSP, PM scholarships, state-level schemes), and online resources. Include 4-6 timeline phases. Be practical and actionable.`;

    console.log("Generating AI roadmap for:", careerName);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from the response (handle markdown code blocks)
    let roadmap;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      roadmap = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Try to extract JSON object directly
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        roadmap = JSON.parse(content.substring(jsonStart, jsonEnd + 1));
      } else {
        throw new Error("Could not parse AI roadmap response");
      }
    }

    console.log("Successfully generated roadmap for:", careerName);

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
