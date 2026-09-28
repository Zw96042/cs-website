/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Stack;

public class Casandra {
	public static void main(String[] args) throws IOException {
		new Casandra().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("casandra.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			String line = file.readLine();

			char[] arr = line.replaceAll("[^A-Z]", "").toCharArray();
			boolean[] present = new boolean[26];
			double count = 0;
			for(char c : arr) {
				count += present[c-'A'] ? 0 : 1;
				present[c-'A'] = true;
			};

			int U = (int) Math.ceil(count / 2.0);
			int D = (int) count - U;
			int numCols = 1 << U;
			int numRows = 1 << D;

			for(int r = 0; r < numRows; r++) {
				int gr = r ^ (r >> 1);
				String Gr = String.format(String.format("%%%ds", D), Integer.toBinaryString(gr)).replaceAll(" ", "0");
				String modifiedLine = line;
				for(int i = 0; i < D; i++) {
					modifiedLine = modifiedLine.replaceAll(String.format("%c", 'A'+i+U), String.format("%c", Gr.charAt(i)));
				}
				for(int c = 0; c < numCols; c++) {
					int gc = c ^ (c >> 1);
					String Gc = String.format(String.format("%%%ds", U), Integer.toBinaryString(gc)).replaceAll(" ", "0");
					String expression = modifiedLine;
					for(int i = 0; i < U; i++) {
						expression = expression.replaceAll(String.format("%c", 'A'+i), String.format("%c", Gc.charAt(i)));
					}
					out.printf("%d ", evaluate(expression) ? 1 : 0);
				}
				out.println();
			}
			out.println("--------");
		}

		file.close();
		out.close();
	}

	private final String precedence = "&^|";
	private boolean hasPrecedence(char operator1, char operator2) {
		if(operator2 == '(' || operator2 == ')') {
			return false;
		}
		return precedence.indexOf(operator1) <= precedence.indexOf(operator2);
	}

	private boolean applyOperation(char operator, boolean... v) {
		switch(operator) {
		case '|': {
			return v[0] | v[1];
		}
		case '&': {
			return v[0] & v[1];
		}
		case '^': {
			return v[0] ^ v[1];
		}
		case '!': {
			return !v[0];
		}
		}
		return false;
	}

	private boolean evaluate(String expression) {
		char[] tokens = expression.toCharArray();

		Stack<Boolean> values = new Stack<Boolean>();
		Stack<Character> operators = new Stack<Character>();

		for(int i = 0; i < tokens.length; i++) {
			if(tokens[i] == '1' || tokens[i] == '0') {
				values.push(tokens[i] == '1');
				// If the previous operation is a NOT, perform it
				while(!operators.isEmpty() && operators.peek() == '!') {
					values.push(applyOperation(operators.pop(), values.pop()));
				}
			} else if(tokens[i] == '(') {
				operators.push('(');
			} else if(tokens[i] == ')') {
				// Until we find the opening of this context...
				while(operators.peek() != '(') {
					// We will never run into a NOT during this section.
					// Either the NOT was handled when reading in a 0 or a 1,
					// or the NOT will be handled after this.
					values.push(applyOperation(operators.pop(), values.pop(), values.pop()));
				}

				// Remove the opening of this context
				operators.pop();

				// If the next instruction is a NOT, perform it.
				while(!operators.isEmpty() && operators.peek() == '!') {
					values.push(applyOperation(operators.pop(), values.pop()));
				}
			} else if(tokens[i] == '!') {
				operators.push(tokens[i]);
			} else {
				while(!operators.isEmpty() && hasPrecedence(tokens[i], operators.peek())) {
					// We will never run into a NOT during this section.
					// Either the NOT was handled when reading in a 0 or a 1,
					// or the NOT will be handled after the current context.
					values.push(applyOperation(operators.pop(), values.pop(), values.pop()));
				}

				operators.push(tokens[i]);
			}
		}

		// There may be some unresolved operations after an initial scan,
		// perform the remaining operations now
		while(!operators.isEmpty()) {
			// We will never run into a NOT during this section.
			// The NOTs should have been handled in the previous section
			values.push(applyOperation(operators.pop(), values.pop(), values.pop()));
		}

		// Final value will be on the top of the values stack
		return values.pop();
	}
}
