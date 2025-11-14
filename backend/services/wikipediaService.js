/**
 * Wikipedia Service
 * Fetches topic data from Wikipedia API
 */

export async function fetchTopicData(topic) {
  try {
    const encodedTopic = encodeURIComponent(topic);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTopic}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Topic "${topic}" not found on Wikipedia`);
      }
      throw new Error(`Wikipedia API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      title: data.title,
      extract: data.extract,
      description: data.description || '',
      url: data.content_urls?.desktop?.page || ''
    };
  } catch (error) {
    if (error.message.includes('not found')) {
      throw error;
    }
    throw new Error(`Failed to fetch topic data: ${error.message}`);
  }
}

