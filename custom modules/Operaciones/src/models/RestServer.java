/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.nio.charset.Charset;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author win
 */
public class RestServer {
    public static String SERVER_URL="http://agilsof.net"; // agilsof.net   http://localhost:8083
    //192.168.1.11
    public static String REST_URL =SERVER_URL+"/agil/";

    public static JSONArray getJSONArray(String url) {
        StringBuilder stringBuilder = new StringBuilder();
        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(REST_URL +url);
        JSONArray res=null;
        try {
            HttpResponse response = httpClient.execute(httpGet);
            StatusLine statusLine = response.getStatusLine();
            int statusCode = statusLine.getStatusCode();
            if (statusCode == 200) {
                HttpEntity entity = response.getEntity();
                InputStream inputStream = entity.getContent();
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream));
                String line;
                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line);
                }
                inputStream.close();
            } else {
                
            }
            res = new JSONArray(stringBuilder.toString());
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            
        }
        return res;
    }

    public static JSONObject postJSONdata(String url,JSONObject datos){
        JSONObject jsonObjectRes=null;
        try {
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPost postRequest = new HttpPost(REST_URL +url);
            StringEntity input = new StringEntity(datos.toString());
            input.setContentType("application/json");
            postRequest.setEntity(input);
            HttpResponse response = httpClient.execute(postRequest);

            BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent()), Charset.forName( "UTF-8" )));
            String output;
            StringBuilder responseStrBuilder = new StringBuilder();
            while ((output = br.readLine()) != null) {
                responseStrBuilder.append(output);
            }

            jsonObjectRes = new JSONObject(responseStrBuilder.toString());
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            try {
                jsonObjectRes = new JSONObject();
                jsonObjectRes.put("type","false");
                jsonObjectRes.put("data","¡Conectese a la red local para acceder a los datos!");
                e.printStackTrace();
            }catch(Exception e2){
                e2.printStackTrace();
            }
        }
        return jsonObjectRes;
    }

     public static JSONObject getJSONObject(String url) {
        StringBuilder stringBuilder = new StringBuilder();
        HttpClient httpClient = new DefaultHttpClient();
        HttpGet httpGet = new HttpGet(REST_URL +url);
        JSONObject res=null;
        try {
            HttpResponse response = httpClient.execute(httpGet);
            StatusLine statusLine = response.getStatusLine();
            int statusCode = statusLine.getStatusCode();
            if (statusCode == 200) {
                HttpEntity entity = response.getEntity();
                InputStream inputStream = entity.getContent();
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream));
                String line;
                while ((line = reader.readLine()) != null) {
                    stringBuilder.append(line);
                }
                inputStream.close();
            } else {
                
            }
            res = new JSONObject(stringBuilder.toString());
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
            
        }
        return res;
    }
     
    /*public static JSONObject putJSONObject(String url, JSONObject datos){
        
        JSONObject jsonObjectRes=null;
        try {
                      
            DefaultHttpClient httpClient = new DefaultHttpClient();
            HttpPut putRequest = new HttpPut(REST_URL +url);
            StringEntity input = new StringEntity(datos.toString());
            input.setContentType("application/json");
            putRequest.setEntity(input);
            HttpResponse response = httpClient.execute(putRequest);
            
            /*if (response.getStatusLine().getStatusCode() != 201) {
             throw new RuntimeException("Failed : HTTP error code : "
              + response.getStatusLine().getStatusCode());
            }*/

            /*BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent()),Charset.forName( "UTF-8" )));
            String output;
            StringBuilder responseStrBuilder = new StringBuilder();
            while ((output = br.readLine()) != null) {
                responseStrBuilder.append(output);
            }
            
            //jsonObjectRes = new JSONObject(responseStrBuilder.toString());
            httpClient.getConnectionManager().shutdown();
        } catch (Exception e) {
             try {
                jsonObjectRes = new JSONObject();
                jsonObjectRes.put("type","false");
                jsonObjectRes.put("data","¡Conectese a la red local para acceder a los datos!");
                e.printStackTrace();
             }catch(Exception e2){
                 e2.printStackTrace();
             }
        }
        return jsonObjectRes;
    }*/
     
     public static JSONObject putJSONdata(String url,JSONObject datos){
        JSONObject jsonObjectRes=null;
        try {

		DefaultHttpClient httpClient = new DefaultHttpClient();
		HttpPut putRequest = new HttpPut(REST_URL +url);

		StringEntity input = new StringEntity(datos.toString());
		input.setContentType("application/json");
		putRequest.setEntity(input);

		HttpResponse response = httpClient.execute(putRequest);

		/*if (response.getStatusLine().getStatusCode() != 201) {
			throw new RuntimeException("Failed : HTTP error code : "
				+ response.getStatusLine().getStatusCode());
		}*/

		BufferedReader br = new BufferedReader(
                        new InputStreamReader((response.getEntity().getContent())));

		String output;
		System.out.println("Output from Server .... \n");
		while ((output = br.readLine()) != null) {
			System.out.println(output);
		}

		httpClient.getConnectionManager().shutdown();

	  } catch (MalformedURLException e) {
		e.printStackTrace();
	  } catch (IOException e) {
		e.printStackTrace();
	  }
        return jsonObjectRes;
    }
}
