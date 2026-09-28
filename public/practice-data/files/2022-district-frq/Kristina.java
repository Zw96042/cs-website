import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Stack;

public class Kristina {

	public static void main(String[] args) throws FileNotFoundException {
		final String op_syms = "^*/+-";
		Scanner data = new Scanner(new File("kristina.dat"));
		int T = data.nextInt();
		Stack<String> ops = new Stack<String>();
		Stack<Integer> nbrs = new Stack<Integer>();
		for (int t = 0; t < T; t++) {
			ops.clear();
			nbrs.clear();
			String p = data.next();
			String line = data.nextLine().trim();
			String [] parts = line.split(" ");
			int n1 = 0, n2 = 0;
			switch (p) {
			case "PRE":
				Stack<Integer> opcount = new Stack<Integer>();
				opcount.push(0);
				for (int i = 0; i < parts.length; i++) {
					if (op_syms.indexOf(parts[i]) != -1) { // operator
						ops.push(parts[i]);
						opcount.push(0);
					}
					else { // operand
						nbrs.push(Integer.parseInt(parts[i]));
						opcount.push(opcount.pop() + 1);
						while (opcount.peek() == 2) { // do operator
							opcount.pop();
							n2 = nbrs.pop();
							n1 = nbrs.pop();
							switch (ops.pop()) {
							case "^":
								nbrs.push((int)Math.pow(n1, n2));
								break;
							case "*":
								nbrs.push(n1 * n2);
								break;
							case "/":
								nbrs.push(n1 / n2);
								break;
							case "+":
								nbrs.push(n1 + n2);
								break;
							case "-":
								nbrs.push(n1 - n2);
								break;
							default:
								break;
							}
							opcount.push(opcount.pop() + 1);

						}
					}
				}
				System.out.println(nbrs.pop());
				break;
			case "POST":
				nbrs.push(Integer.parseInt(parts[0]));
				nbrs.push(Integer.parseInt(parts[1]));
				for (int i = 2; i < parts.length; i++) {
					if (op_syms.indexOf(parts[i]) != -1) { // operator
						n2 = nbrs.pop();
						n1 = nbrs.pop();
						switch (parts[i]) {
						case "^":
							nbrs.push((int)Math.pow(n1, n2));
							break;
						case "*":
							nbrs.push(n1 * n2);
							break;
						case "/":
							nbrs.push(n1 / n2);
							break;
						case "+":
							nbrs.push(n1 + n2);
							break;
						case "-":
							nbrs.push(n1 - n2);
							break;
						default:
							break;
						}
					}
					else { // operand
						nbrs.push(Integer.parseInt(parts[i]));
					}
				}
				System.out.println(nbrs.pop());
				if (nbrs.size() != 0) System.out.println("WARNING -- Stack NOT empty!");
				break;
			default:
				break;
			}
		}
		data.close();
	}
}
