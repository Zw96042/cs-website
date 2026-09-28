/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Stack;
import java.util.StringTokenizer;

public class Nicholas {
	private class Interval implements Comparable<Interval> {
		public int start, finish, value, id;

		public Interval(int s, int f, int v, int i) {
			this.start = s;
			this.finish = f;
			this.value = v;
			this.id = i;
		}

		@Override
		public int compareTo(Interval other) {
			int comp = Integer.compare(this.finish, other.finish);
			if(comp == 0) {
				comp = Integer.compare(this.value, other.value);
				return comp == 0 ? Integer.compare(this.id, other.id) : -comp;
			}
			return comp;
		}
	}

	private class Entry {
		public int maximalValue, prevIndex;

		public Entry(int v, int i) {
			this.maximalValue = v;
			this.prevIndex = i;
		}
	}

	public static void main(String[] args) throws IOException {
		new Nicholas().run();
	}

	public void run() throws IOException {
		BufferedReader file = new BufferedReader(new FileReader("nicholas.dat"));
		PrintWriter out = new PrintWriter(System.out);

		int numTimes = Integer.parseInt(file.readLine());
		while(numTimes-->0) {
			int m = Integer.parseInt(file.readLine());
			String[] arr = file.readLine().split(",");
			Interval[] events = new Interval[m];
			for(int i = 0; i < m; i++) {
				StringTokenizer st = new StringTokenizer(arr[i]);
				int si = Integer.parseInt(st.nextToken());
				int fi = Integer.parseInt(st.nextToken());
				int vi = Integer.parseInt(st.nextToken());
				events[i] = new Interval(si, fi, vi, i+1);
			}
			Arrays.sort(events);

			Entry[] dp = bottomUp(events, m);
			int[] selectedEvents = getEvents(events, dp, m);
			out.println(Arrays.toString(selectedEvents).replaceAll("[\\[\\],]", ""));
		}

		file.close();
		out.close();
	}

	public int binarySearch(Interval[] events, int index) {
		int low = 0, high = index - 1;

		while(low <= high) {
			int mid = (low + high) / 2;
			if(events[mid].finish <= events[index].start) {
				if(events[mid+1].finish <= events[index].start) {
					low = mid + 1;
				} else {
					return mid;
				}
			} else {
				high = mid - 1;
			}
		}

		return -1;
	}

	public Entry[] bottomUp(Interval[] events, int m) {
		Entry[] dp = new Entry[m];
		dp[0] = new Entry(events[0].value, -1);

		for(int i = 1; i < m; i++) {
			int includeValue = events[i].value;
			int index = binarySearch(events, i);
			if(index != -1) {
				includeValue += dp[index].maximalValue;
			}

			if(dp[i-1].maximalValue > includeValue) {
				dp[i] = dp[i-1];
			} else {
				dp[i] = new Entry(includeValue, index);
			}
		}

		return dp;
	}

	public int[] getEvents(Interval[] events, Entry[] dp, int m) {
		Stack<Integer> currEvents = new Stack<Integer>();
		for(int i = m-1; i >= 0; i = dp[i].prevIndex) {
			currEvents.push(events[i].id);
		}

		int mPrime = currEvents.size();
		int[] selectedEvents = new int[mPrime];
		for(int i = 0; i < mPrime; i++) {
			selectedEvents[i] = currEvents.pop();
		}

		return selectedEvents;
	}
}
