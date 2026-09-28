import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Ivan {

	public static void main(String[] args) throws FileNotFoundException {
		Scanner data = new Scanner(new File("ivan.dat"));
		int T = data.nextInt();
		data.nextLine();
		String key = data.nextLine();
		for (int t = 1; t <= T; t++) {
			String exam = data.nextLine();
			int correct = 0, wrong = 0, noans = 0, score = 0;
			for (int i = 0; i < 40; i++)
				if (exam.charAt(i) == '_') noans++;
				else if (exam.charAt(i) == key.charAt(i)) correct++;
				else wrong++;
			score = correct * 6 - wrong * 2;
			float pct = (correct + wrong > 0) ? (float)correct / (correct + wrong) : 0;
			//System.out.printf("Exam #%d: %s\n", t, exam);
			//System.out.printf("Exam #%d: %d %d %d\n", t, correct, wrong, noans);
			System.out.printf("Exam #%d: %d %3.1f\n", t, score, pct * 100);
		}
		data.close();
	}
}
