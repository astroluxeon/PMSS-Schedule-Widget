import datetime

start = datetime.date(2023, 9, 6)
end = datetime.date(2024, 6, 28)
current = datetime.date.today()

if current == datetime.date(2023, 9, 5): print("Back to School!")
elif current.weekday() >= 5: print("Weekend")
elif current > end: print("Have a Good Summer!")
else: print("Day 1" if (current - start).days%2 == 0 else "Day 2")

print(current)
