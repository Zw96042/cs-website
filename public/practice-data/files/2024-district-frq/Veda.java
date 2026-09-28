/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Arrays;

public class Veda {
	public static void main(String[] args) throws IOException {
		new Veda().run();
	}
	
	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("veda.dat"));
		PrintWriter out = new PrintWriter(System.out);
		
		int n = Integer.parseInt(file.readLine());
		HashMap<Character, Double> letterToPrice = new HashMap<Character, Double>();
		while(n-->0) {
			String[] line = file.readLine().split("[,:]");
			double p = Double.parseDouble(line[line.length-1]);
			for(int i = 0; i < line.length-1; i++) {
				letterToPrice.put(line[i].charAt(0), p);
			}
		}
		
		int m = Integer.parseInt(file.readLine());
		while(m-->0) {
			out.printf("$%.2f\n", Arrays.asList(file.readLine().replaceAll("[^A-Z]", "").split("")).stream().map(character -> letterToPrice.get(character.charAt(0))).mapToDouble(Double::doubleValue).sum());
		}
		
		file.close();
		out.close();
	}
}
