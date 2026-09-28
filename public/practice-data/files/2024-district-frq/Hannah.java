/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Hannah {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("hannah.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int N = data.nextInt();
			String [] school = new String[N];
			String [] classlevel = new String[N];
			int [][] progscores = new int[N][12];
			int [][] testscores = new int[N][3];
			int [] teamscores = new int[N];
			int [][] scores_teams = new int[N][2];  // position [1] is team number
			for (int n = 0; n < N; n++) {
				school[n] = data.next();
				classlevel[n] = data.next();
				for (int s = 0; s < 12; s++) {
					progscores[n][s] = data.nextInt();
					teamscores[n] += progscores[n][s];
				}
			}

			for (int n = 0; n < N; n++) {
				data.next();  // dispose of school
				for (int s = 0; s < 3; s++) {
					testscores[n][s] = data.nextInt();
					teamscores[n] += testscores[n][s];
				}
				scores_teams[n][0] = teamscores[n];
				scores_teams[n][1] = n;
			}

			for (int p = 0; p < N-1; p++) {
				for (int i = p+1; i < N; i++) {
					if (scores_teams[i][0] > scores_teams[p][0]) {
						int temp0 = scores_teams[p][0];
						int temp1 = scores_teams[p][1];
						scores_teams[p][0] = scores_teams[i][0];
						scores_teams[p][1] = scores_teams[i][1];
						scores_teams[i][0] = temp0;
						scores_teams[i][1] = temp1;
					}
				}
			}

			for (char curr_level = '1'; curr_level <= '6'; curr_level++) {
				System.out.printf("Classification %cA Results\n", curr_level);
				for (int i = 0; i < N; i++)
					if (classlevel[scores_teams[i][1]].charAt(0) == curr_level)
						System.out.printf("%s %d\n", school[scores_teams[i][1]], scores_teams[i][0]);
			}
			System.out.printf("=========================\n", t, N);
		}
	}
}
