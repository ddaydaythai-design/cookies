
import { GoogleGenAI } from "@google/genai";
import { Order, Product } from "../types";

export const getBusinessInsights = async (orders: Order[], products: Product[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare a summary of data for the AI
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.totalProfit, 0);
  const orderCount = orders.length;

  const prompt = `
    你是一個專業的商業分析師。請根據以下 POS 數據提供簡短的經營建議（約 150 字）：
    - 總訂單數: ${orderCount}
    - 總銷售額: $${totalSales}
    - 總利潤: $${totalProfit}
    - 平均客單價: $${orderCount > 0 ? (totalSales / orderCount).toFixed(2) : 0}
    
    請重點分析利潤率，並給予 2-3 個具體的改進建議（例如：成本控制、熱門產品推廣）。
    請用繁體中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "無法獲取分析建議。";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "AI 分析暫時不可用，請檢查網路或 API 金鑰。";
  }
};
