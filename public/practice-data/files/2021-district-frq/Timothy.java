import java.util.*;
import java.io.*;
import static java.lang.System.out;
public class Timothy {
	
	public static ArrayList<Number> list = new ArrayList<Number>();

	public static void main(String[] args) throws IOException{
		Scanner file = new Scanner(new File("timothy.dat"));
		while(file.hasNextInt()) {
			int currentNumber = file.nextInt();
			int position = find(currentNumber);
			if(position != -1)
				list.get(position).incrementCount();
			else
				list.add(new Number(currentNumber));
			}
		Collections.sort(list);
		for(Number n:list)
			out.println(n);
		}

	
	
	public static int find(int n) {
		for(int x = 0; x < list.size(); x++) 
			if(n == list.get(x).number)
				return x;
		return -1;
	}
	
	public static class Number implements Comparable{
		int number;
		int count;
		
		public Number(int n) {
			number = n;
			count = 1;
		}
		
		public void incrementCount() {
			count++;
		}
		
		public String toString() {
			if(count > 1)
				return number + " " + (count - 1);
			else
				return "" + number;
		}

		public int compareTo(Object num) {
			Number n = (Number)num;
			if(n.number < number)
				return -1;
			else if(n.number > number)
				return 1;
			else
				return 0;
		}
	}

}
