import { css } from 'styled-components';
import { message } from 'antd';

export const OnLinkHover = css`
&:hover {
   color: orange;
   transition-property: color;
   transition-timing-function: ease-in-out;
   transition-duration: 0.2s;
}
`;

/**
 * It takes a file and returns a promise that resolves to the base64 representation of the file.
 * @param file - The file to be converted to base64
 */
export const getBase64 = (file) =>
   new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
 });

/**
 * If the file is not a JPG or PNG, or if the file is larger than 2MB, then return false.
 * @param file - The file object that is being uploaded.
 * @returns isJpgOrPng && isLt2M
 */
export const beforeUpload = (file) => {
   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

   if (!isJpgOrPng) {
         message.error('You can only upload JPG/PNG file!');
   }

   const isLt2M = file.size / 1024 / 1024 < 2;

   if (!isLt2M) {
         message.error('Image must smaller than 2MB!');
   }

   return isJpgOrPng && isLt2M;
 };

/**
 * It takes a file and a callback function as arguments, and then calls the callback function after a
 * timeout of 0 milliseconds
 */
export const dummyRequest = ({ file, onSuccess }) => {
   setTimeout(() => {
        onSuccess("ok");
   }, 0);
 };
