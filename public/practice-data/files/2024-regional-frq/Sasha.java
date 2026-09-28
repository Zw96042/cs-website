/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

public class Sasha {
	public static void main(String[] args) throws IOException {
		new Sasha().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("sasha.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) { 
			int m = Integer.parseInt(file.readLine());
			int[] h = Arrays.asList(file.readLine().split(" ")).stream().map(str -> Integer.parseInt(str)).mapToInt(Integer::intValue).toArray();
			int[] maxLeft = new int[m];
			int[] maxRight = new int[m];
			int[] volume = new int[m];
			maxLeft[0] = maxRight[m-1] = 0;

			for(int i = 1; i < m; i++) {
				maxLeft[i] = maxLeft[i-1] > h[i-1] ? maxLeft[i-1] : h[i-1];
			}

			for(int i = m-2; i > 0; i--) {
				maxRight[i] = maxRight[i+1] > h[i+1] ? maxRight[i+1] : h[i+1];
			}

			for(int i = 0; i < m; i++) {
				int possibleVolume = (maxRight[i] < maxLeft[i] ? maxRight[i] : maxLeft[i]) - h[i];
				volume[i] = possibleVolume < 0 ? 0 : possibleVolume;
			}

			// At most m/2 unique buckets 
			long[] buckets = new long[m/2];
			int index = -1, total = 0;
			// First and last columns will always have a volume of 0
			// Iterate over the last column to handle any remaining bucket
			for(int i = 1; i < m; i++) {
				if(volume[i-1] == 0 && volume[i] != 0) {
					index++;
					buckets[index] = volume[i];
					total += volume[i];
				} else if(volume[i] != 0) {
					buckets[index] += volume[i];
					total += volume[i];
				}
			}

			if(index == -1) {
				out.println("Dry as a Bone...");
			} else {
				for(int i = 0; i <= index; i++) {
					out.print(String.format("%d ", buckets[i]));
				}
				out.println(total);
			}
		}

		file.close();
		out.close();
	}
}
