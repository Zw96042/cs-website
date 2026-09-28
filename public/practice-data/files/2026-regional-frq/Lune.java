import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Lune {
    public static void main(String[] args) throws IOException {
        new Lune().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("lune.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        while (T-- > 0) {
            StringTokenizer st = new StringTokenizer(file.readLine());
            int n = Integer.parseInt(st.nextToken());
            int q = Integer.parseInt(st.nextToken());

            // Read array
            int[] A = Arrays.asList(file.readLine().split(" ")).stream().mapToInt(Integer::parseInt).toArray();

            // Build prefix XOR array
            // prefixXor[i] = A[0] XOR A[1] XOR ... XOR A[i-1]
            int[] prefixXor = new int[n + 1];
            prefixXor[0] = 0;
            for (int i = 0; i < n; i++) {
                prefixXor[i + 1] = prefixXor[i] ^ A[i];
            }

            // Process queries
            for (int i = 0; i < q; i++) {
                st = new StringTokenizer(file.readLine());
                int l = Integer.parseInt(st.nextToken());
                int r = Integer.parseInt(st.nextToken());

                // XOR of range [l, r] = prefixXor[r + 1] XOR prefixXor[l]
                int result = prefixXor[r + 1] ^ prefixXor[l];
                out.println(result);
            }
        }
    }
}
