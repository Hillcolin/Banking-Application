interface EmailRequest {
    email: string;
    message: string;
  }
  
  interface ApiResponse {
    success: boolean;
    message?: string;
  }
  
  const API_URL = 'http://127.0.0.1:5001';
  
  export const sendEmail = async (data: EmailRequest): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Failed to send message',
        };
      }
  
      return { success: true };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  };
  