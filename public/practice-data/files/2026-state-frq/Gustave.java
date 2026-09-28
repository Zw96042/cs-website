import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

public class Gustave {
    public static void main(String[] args) throws IOException {
        new Gustave().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("gustave.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        while (T-- > 0) {
            long n = Long.parseLong(file.readLine());
            long msb = Long.highestOneBit(n);
            out.println(((n ^ msb) << 1L) | 1L);
        }
    }
}
