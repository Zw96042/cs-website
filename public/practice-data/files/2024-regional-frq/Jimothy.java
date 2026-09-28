/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Jimothy {
	public static void main(String[]args)throws Exception{
		new Jimothy().run();
	}
	public void run()throws Exception{
		Scanner file=new Scanner(new File("jimothy.dat"));
		int times=file.nextInt(), num = 1;
		file.nextLine();
		while(times-->0) {
			String[] lis = file.nextLine().trim().split("\\s+");
			Node root = new Node(lis[0]);
			for(int y = 1; y < lis.length; y++) {
				Node n = new Node(lis[y]);
				root.add(n);
			}
			System.out.println("TEST CASE #"+ num++ + ":");
			System.out.print("PRE-ORDER TRAVERSAL: ");
			System.out.println(pre(root).trim());
			System.out.print("IN-ORDER TRAVERSAL: ");
			System.out.println(in(root).trim());
			System.out.print("POST-ORDER TRAVERSAL: ");
			System.out.println(post(root).trim());
			System.out.print("REVERSE-ORDER TRAVERSAL: ");
			System.out.println(reverse(root).trim());
		}
	}

	public boolean isLeaf(Node n) {
		return n.left == null && n.right == null;
	}

	public String pre(Node curr) {
		if(isLeaf(curr))
			return curr.val + " ";
		else if(curr.left == null)
			return curr.val + " " + pre(curr.right);
		else if(curr.right == null)
			return curr.val + " " + pre(curr.left);
		else
			return curr.val + " " + pre(curr.left) + pre(curr.right);
	}

	public String in(Node curr) {
		if(isLeaf(curr))
			return curr.val + " ";
		else if(curr.left == null)
			return curr.val + " " + in(curr.right);
		else if(curr.right == null)
			return in(curr.left) + curr.val + " ";
		else
			return in(curr.left) + curr.val + " " + in(curr.right);
	}

	public String post(Node curr) {
		if(isLeaf(curr))
			return curr.val + " ";
		else if(curr.left == null)
			return post(curr.right) + curr.val + " ";
		else if(curr.right == null)
			return post(curr.left) + curr.val + " ";
		else
			return post(curr.left) + post(curr.right) + curr.val+ " ";
	}

	public String reverse(Node curr) {
		if(isLeaf(curr))
			return curr.val + " ";
		else if(curr.right == null)
			return curr.val + " " + reverse(curr.left);
		else if(curr.left == null)
			return reverse(curr.right) + curr.val + " ";
		else
			return reverse(curr.right) + curr.val + " " + reverse(curr.left);
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