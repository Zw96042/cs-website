/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

public class Manisha {
	public class Token implements Comparable<Token> {
		private char c;
		private boolean hasBar;
		public Token(char c, boolean hasBar) {
			this.c = c;
			this.hasBar = hasBar;
		}
		public int compareTo(Token other) {
			// Secondary Sort: Character
			int comp = Character.compare(c, other.c);
			// Ternary Sort: Bar or not bar
			return comp != 0 ? comp : Boolean.compare(hasBar, other.hasBar);
		}
	}

	public class TokenString implements Comparable<TokenString> {
		private ArrayList<Token> tokens;
		public TokenString(String s) {
			tokens = new ArrayList<Token>();
			boolean hasBar = false;
			for (int i = 0; i < s.length(); i++) {
				if(s.charAt(i) == '/') {
					hasBar = true;
					continue;
				} else {
					tokens.add(new Token(s.charAt(i), hasBar));
					hasBar = false;
				}
			}
			// Ensure that terms within the product are sorted
			Collections.sort(tokens);
		}

		@Override
		public int compareTo(TokenString other) {
			// Primary sort: length
			int comp1 = Integer.compare(tokens.size(), other.tokens.size());
			if(comp1 != 0) {
				return comp1;
			} else {
				for (int i = 0; i < tokens.size(); i++) {
					int comp2 = tokens.get(i).compareTo(other.tokens.get(i));
					if(comp2 != 0) {
						return comp2;
					}
				}
				return 0;
			}
		}

		@Override
		public String toString() {
			StringBuilder sb = new StringBuilder();
			for (Token t : tokens) {
				if(t.hasBar) {
					sb.append('/');
				}
				sb.append(t.c);
			}
			return sb.toString();
		}
	}

	public static void main(String[] args) throws IOException {
		new Manisha().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("manisha.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			TokenString[] tokenStrings = Arrays.asList(file.readLine().replaceAll("[^A-Z/+]", "").split("[+]")).stream().map(s -> new TokenString(s)).toArray(TokenString[]::new);
			Arrays.sort(tokenStrings);

			StringBuilder ans = new StringBuilder();
			for (TokenString ts : tokenStrings) {
				ans.append(ts.toString());
				ans.append("+");
			}
			out.printf("%s\n", ans.substring(0, ans.length() - 1));
		}

		file.close();
		out.close();
	}
}