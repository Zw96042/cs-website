/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Lina {
	public static void main(String[]args)throws Exception{
		new Lina().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("lina.dat"));
		int times=file.nextInt(), num = 1;
		file.nextLine();
		while(times-->0) {
			String[] lis = file.nextLine().trim().split("\\s+");
			Node root = new Node(lis[0]);
			Integer[] dep = new Integer[lis.length];
			Arrays.fill(dep, 0);
			dep[0] = 1;
			int height = 0;
			for(int y = 1; y < lis.length; y++) {
				Node n = new Node(lis[y]);
				int d = root.add(n);
				dep[d]++;
				height = Math.max(height, d);
			}
			int leaves = countLeaves(root);
			int diameter = diameter(root);
			int width = Collections.max(Arrays.asList(dep));
			System.out.println("TEST CASE #"+ num++ + ":");
			System.out.println("DIAMETER OF THE TREE: " + diameter);
			System.out.println("WIDTH OF THE TREE: " + width);
			System.out.println("HEIGHT OF THE TREE: " + height);
			System.out.println("NUMBER OF LEAVES IN THE TREE: " + leaves);
		}
	}

	public boolean isLeaf(Node n) {
		return n.left == null && n.right == null;
	}

	public int countLeaves(Node curr) {
		if(isLeaf(curr))
			return 1;
		else if(curr.left == null)
			return countLeaves(curr.right);
		else if(curr.right == null)
			return countLeaves(curr.left);
		return countLeaves(curr.right) + countLeaves(curr.left);
	}

	public int maxDepth(Node curr) {
		if(isLeaf(curr))
			return curr.depth;
		else if(curr.left == null)
			return maxDepth(curr.right);
		else if(curr.right == null)
			return maxDepth(curr.left);
		else
			return Math.max(maxDepth(curr.left), maxDepth(curr.right));
	}

	public int diameter(Node root) {
		if(isLeaf(root))
			return 0;
		else if(root.left == null)
			return maxDepth(root.right);
		else if(root.right == null)
			return maxDepth(root.left);
		else
			return maxDepth(root.left) + maxDepth(root.right);
	}
}
class Node{
	Node left, right, parent;
	String val;
	int depth;

	public Node(String s) {
		val = s;
		left = null;
		right = null;
		parent = null;
		depth = 0;
	}

	public int add(Node n) {
		n.depth++;
		if(val.compareTo(n.val) < 0) {
			if(right == null) {
				right = n;
				return n.depth;
			}
			else
				return right.add(n);
		}
		else {
			if(left == null) {
				left = n;
				return n.depth;
			}
			else
				return left.add(n);
		}
	}
}