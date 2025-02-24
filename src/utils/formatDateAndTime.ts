const formatDateAndTime = (dateTime: string) => {
  const newDate = new Date(dateTime);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  const hour = newDate.getHours();
  const minute = newDate.getMinutes();
  const second = newDate.getSeconds();

  return `${year}년 ${month}월 ${date}일 ${hour}시 ${minute}분 ${second}초`;
};

export default formatDateAndTime;
