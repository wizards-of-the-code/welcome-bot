import { getRandomInt } from '../scenes/helpers';
import { CaptchaGenerator } from 'captcha-canvas';
import { User } from '@telegraf/types';
import { fmt, mention } from 'telegraf/format';

export const captchaTextLength = 6;

export type GenerateCaptchaMessageParams = {
  user: User;
  leftAttempts: number;
  taskDeadline: number;
  banTime: number;
};

export type GenerateDigitCaptchaMessage = GenerateCaptchaMessageParams & {
  firstNumber: number;
  secondNumber: number;
};

export type GenerateImageCaptchaMessage = GenerateCaptchaMessageParams;

export const getDigitCaptchaMessage = ({
  user,
  banTime,
  leftAttempts,
  taskDeadline,
  firstNumber,
  secondNumber,
}: GenerateDigitCaptchaMessage) => {
  return fmt`${mention(
    user.username || user.first_name,
    user.id,
  )}\nWhat is the result of ${firstNumber} + ${secondNumber}?\n\nEnter characters from image.\n\nLeft attempts - ${leftAttempts}.\n\nYou have ${taskDeadline} seconds for each attempt to solve the task.\nIf you don't send answer during any of the attempts you will be kicked from the chat and banned for ${banTime}h.`;
};

export const generateDigitCaptcha = () => {
  const [firstNumber, secondNumber] = [getRandomInt(0, 11), getRandomInt(0, 20)];
  return {
    answer: firstNumber + secondNumber,
    captcha: { firstNumber, secondNumber },
  };
};

const generateCaptchaText = (length: number) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    captcha += charset[randomIndex];
  }
  return captcha;
};

export const getImageCaptchaMessage = ({
  user,
  banTime,
  leftAttempts,
  taskDeadline,
}: GenerateImageCaptchaMessage) => {
  return fmt`${mention(
    user.username || user.first_name,
    user.id,
  )}\nEnter characters from image.\n\nLeft attempts - ${leftAttempts}.\n\nYou have ${taskDeadline} seconds for each attempt to solve the task.\nIf you don't send answer during any of the attempts you will be kicked from the chat and banned for ${banTime}h.`;
};

export const generateImageCaptcha = () => {
  const captcha = new CaptchaGenerator()
    .setDimension(150, 450)
    .setCaptcha({ text: generateCaptchaText(captchaTextLength), size: 60, color: 'deeppink' })
    .setDecoy({ opacity: 0.5 })
    .setTrace({ color: 'deeppink' });
  const buffer = captcha.generateSync(); //everything is optional simply using `new CaptchaGenerator()` will also work.
  return {
    answer: captcha.text?.toLocaleLowerCase(),
    captcha: { source: buffer },
  };
};
