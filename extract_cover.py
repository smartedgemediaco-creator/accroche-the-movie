import cv2
import os

src = r"C:\Users\hp\Documents\Oluwaseun Abajingin\Àfárà Digital Solutions\products\acrocche\accroche-the-movie\public\videos\unndlea-graded.mp4"
dst = r"C:\Users\hp\Documents\Oluwaseun Abajingin\Àfárà Digital Solutions\products\acrocche\accroche-the-movie\public\images\unndlea-cover.jpg"

cap = cv2.VideoCapture(src)
if not cap.isOpened():
    raise SystemExit(f"Could not open video: {src}")

cap.set(cv2.CAP_PROP_POS_MSEC, 3000)
ret, frame = cap.read()
cap.release()

if not ret or frame is None:
    raise SystemExit("Could not read frame from video")

os.makedirs(os.path.dirname(dst), exist_ok=True)
cv2.imwrite(dst, frame)
print(f"Saved: {dst}")
