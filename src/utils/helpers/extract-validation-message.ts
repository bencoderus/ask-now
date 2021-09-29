const extractValidationMessage = (error: any): string => {
  const message = error.details.map((i: any) => i.message).join(',');
  return message.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>{}[\]\\/]/gi, '');
};

export default extractValidationMessage;
