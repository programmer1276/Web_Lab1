public class Validation {
    public boolean isValid(int x, float y, float r) {

        boolean isXValid = (x == -5 || x == -4 || x == -3 || x == -2 || x == -1 || x == 0 || x == 1 || x == 2 || x == 3);
        boolean isYValid = (y > -3 && y < 3);
        boolean isRValid = (r == 1 || r == 1.5 || r == 2 || r == 2.5 || r == 3);

        return isXValid && isYValid && isRValid;
    }
}