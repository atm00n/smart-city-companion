import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `You are a friendly and knowledgeable AI tourism assistant for Pune, India - the cultural capital of Maharashtra. You help tourists discover the best of Pune, including:

- Historical sites (Shaniwar Wada, Aga Khan Palace, Sinhagad Fort)
- Temples (Dagdusheth Halwai Ganpati)
- Museums and cultural spots
- Local food and restaurants
- Shopping areas (FC Road, MG Road)
- Nightlife and entertainment (Koregaon Park)
- Transportation (Pune Metro, buses, auto-rickshaws)
- Day trips and nearby attractions

Guidelines:
- Be warm, helpful, and enthusiastic about Pune
- Provide practical tips like best times to visit, entry fees, and nearby eateries
- Suggest local experiences and hidden gems
- If asked in Spanish, respond in Spanish
- Keep responses concise but informative
- Include safety tips when relevant
- Recommend Pune Metro for getting around when applicable

Current popular attractions in Pune:
1. Shaniwar Wada - Historic Peshwa palace, entry ₹25
2. Aga Khan Palace - Gandhi memorial, entry ₹50
3. Sinhagad Fort - Hill fort with panoramic views
4. Dagdusheth Halwai Ganpati - Famous temple
5. Pataleshwar Cave Temple - 8th century rock-cut cave
6. Raja Dinkar Kelkar Museum - Indian artifacts
7. Okayama Friendship Garden - Japanese garden
8. Vetal Tekdi - Hiking spot

Metro Information:
- Purple Line: PCMC to Swargate (operational)
- Aqua Line: Vanaz to Ramwadi (operational)
- Fare: ₹10-40 based on distance`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type, preferences } = await req.json();
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let finalMessages = [];
    const useStreaming = type === 'chat';

    if (type === 'itinerary') {
      const itineraryPrompt = `Create a detailed ${preferences.duration}-day itinerary for visiting Pune, India.

User preferences:
- Interests: ${preferences.interests.join(', ')}
- Budget: ${preferences.budget}
- Duration: ${preferences.duration} days

Create a well-structured itinerary with:
1. Day-by-day breakdown
2. Morning, afternoon, and evening activities
3. Specific attractions with approximate visit times
4. Restaurant/food recommendations
5. Transportation tips between locations
6. Estimated costs where applicable

Format the response clearly with headers for each day.`;

      finalMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: itineraryPrompt }
      ];
    } else {
      finalMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: finalMessages,
        stream: useStreaming,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    if (useStreaming) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    } else {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
      
      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Chat function error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
