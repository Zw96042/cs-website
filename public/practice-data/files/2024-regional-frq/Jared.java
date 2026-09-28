/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

public class Jared {
	private class Tree {
		private class Node {
			public boolean isLeaf, isStratagem;
			public Node left, right, down, up;

			public Node() {
				isLeaf = true;
			}
		}

		Node root;

		public Tree() {
			this.root = new Node();
		}

		public void addNewStratagem(String code) {
			Node curr = root;
			for(int i = 0; i < code.length(); i++) {
				char currDir = code.charAt(i);
				switch(currDir) {
				case 'L': {
					if(curr.left == null) {
						curr.left = new Node();
					}
					curr.isLeaf = false;
					curr = curr.left;
					break;
				}
				case 'R': {
					if(curr.right == null) {
						curr.right = new Node();
					}
					curr.isLeaf = false;
					curr = curr.right;
					break;
				}
				case 'D': {
					if(curr.down == null) {
						curr.down = new Node();
					}
					curr.isLeaf = false;
					curr = curr.down;
					break;
				}
				case 'U': {
					if(curr.up == null) {
						curr.up = new Node();
					}
					curr.isLeaf = false;
					curr = curr.up;
					break;
				}
				}
				if(i == code.length()-1) {
					curr.isStratagem = true;
				}
			}
		}

		public int getNumPrefixes() {
			return getNumPrefixes(root)[1];
		}

		private int[] getNumPrefixes(Node n) {
			// ans is in the form of [#of stratagems, #of prefix issues] in this subtree
			int[] ans = new int[] {n.isStratagem ? 1 : 0, 0};
			if(n.isLeaf) {
				return ans;
			}

			if(n.left != null) {
				int[] leftAns = getNumPrefixes(n.left);
				if(n.isStratagem && !n.isLeaf) {
					ans[1] += leftAns[0];
				}
				ans[0] += leftAns[0];
				ans[1] += leftAns[1];
			}
			if(n.right != null) {
				int[] rightAns = getNumPrefixes(n.right);
				if(n.isStratagem && !n.isLeaf) {
					ans[1] += rightAns[0];
				}
				ans[0] += rightAns[0];
				ans[1] += rightAns[1];
			}
			if(n.up != null) {
				int[] upAns = getNumPrefixes(n.up);
				if(n.isStratagem && !n.isLeaf) {
					ans[1] += upAns[0];
				}
				ans[0] += upAns[0];
				ans[1] += upAns[1];
			}
			if(n.down != null) {
				int[] downAns = getNumPrefixes(n.down);
				if(n.isStratagem && !n.isLeaf) {
					ans[1] += downAns[0];
				}
				ans[0] += downAns[0];
				ans[1] += downAns[1];
			}

			return ans;
		}
	}


	public static void main(String[] args) throws IOException {
		new Jared().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("jared.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			Tree t = new Tree();
			Arrays.asList(file.readLine().split(",")).forEach(code -> t.addNewStratagem(code));
			int numPrefixes = t.getNumPrefixes();
			out.println(numPrefixes == 0 ? "Democracy Prevails!" : String.format("There are %d misinputs...", numPrefixes));
		}

		file.close();
		out.close();
	}
}
