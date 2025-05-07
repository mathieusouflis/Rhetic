import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  AtSign,
  Bell,
  BoldIcon,
  Bolt,
  Bookmark,
  ChartNoAxesColumn,
  ChevronDown,
  ChevronRight,
  Code,
  Command,
  Crown,
  Ellipsis,
  EyeOff,
  Flame,
  Github,
  Globe,
  ImagePlus,
  Italic,
  Languages,
  Mail,
  MailOpen,
  MessageCircle,
  Plus,
  Search,
  SendHorizonal,
  Share2,
  Shield,
  Sparkles,
  SquarePlay,
  Star,
  Strikethrough,
  Table,
  UserRound,
  UserRoundPen,
  X,
} from "lucide-react";
import React from "react";

interface IconProps {
  name: IconName;
  full?: boolean;
  size?: IconSizes;
  color?: string;
  className?: string;
}

// Add more icon names as needed
export type IconName =
  | "home"
  | "flame"
  | "search"
  | "bell"
  | "mail"
  | "bookmark"
  | "user"
  | "settings"
  | "shield"
  | "crown"
  | "star"
  | "code"
  | "comment"
  | "arrow_left"
  | "arrow_right"
  | "arrow_up_right"
  | "plus"
  | "chart"
  | "chevron_down"
  | "chevron_right"
  | "ellipsis"
  | "arrow_big_down"
  | "arrow_big_up"
  | "at_sign"
  | "image_plus"
  | "video"
  | "table"
  | "bold"
  | "italic"
  | "strikethrough"
  | "eye_off"
  | "share"
  | "sparkles"
  | "globe"
  | "command"
  | "x"
  | "send"
  | "user_edit"
  | "asterisk"
  | "languages"
  | "github"
  | "apple"
  | "google"
  | "logo"
  | "logo_text";
export type IconSizes = 12 | 14 | 17 | 18 | 20 | 38 | 62;

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = "currentColor",
  full = false,
  className = "",
}) => {
  const icons = {
    home: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 17 17"
        fill={full ? color : "none"}
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M2.2566 6.48667C2.16986 6.67361 2.12495 6.87721 2.125 7.08329V13.4583C2.125 13.834 2.27426 14.1943 2.53993 14.46C2.80561 14.7257 3.16594 14.875 3.54167 14.875H13.4583C13.8341 14.875 14.1944 14.7257 14.4601 14.46C14.7257 14.1943 14.875 13.834 14.875 13.4583V7.08329C14.875 6.87721 14.8301 6.67361 14.7434 6.48667C14.6567 6.29974 14.5302 6.13398 14.3728 6.00096L9.41446 1.75167C9.15876 1.53556 8.83479 1.41699 8.5 1.41699C8.16521 1.41699 7.84124 1.53556 7.58554 1.75167L2.62721 6.00096C2.46982 6.13398 2.34334 6.29974 2.2566 6.48667Z"
          stroke={color ? color : "white"}
          strokeWidth="0.9375"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    flame: (
      <Flame
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    x: (
      <X
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    search: (
      <Search
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    bell: (
      <Bell
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    mail: full ? (
      <MailOpen
        width={size}
        height={size}
        color={color}
        fill={color}
        className={className}
      />
    ) : (
      <Mail width={size} height={size} color={color} className={className} />
    ),
    bookmark: (
      <Bookmark
        width={size}
        height={size}
        fill={full ? color : "none"}
        color={color}
        className={className}
      />
    ),
    user: (
      <UserRound
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    settings: (
      <Bolt
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    shield: (
      <Shield
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    crown: (
      <Crown
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    star: (
      <Star
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    code: (
      <Code
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    comment: (
      <MessageCircle
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    arrow_left: (
      <ArrowLeft
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    arrow_right: (
      <ArrowRight
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    arrow_up_right: (
      <ArrowUpRight
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    plus: (
      <Plus
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    chart: (
      <ChartNoAxesColumn
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    chevron_down: (
      <ChevronDown
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    chevron_right: (
      <ChevronRight
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    ellipsis: (
      <Ellipsis
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    arrow_big_down: (
      <ArrowBigDown
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    arrow_big_up: (
      <ArrowBigUp
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    at_sign: (
      <AtSign
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    image_plus: (
      <ImagePlus
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    video: (
      <SquarePlay
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    table: (
      <Table
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    bold: (
      <BoldIcon
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    italic: (
      <Italic
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    strikethrough: (
      <Strikethrough
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    eye_off: (
      <EyeOff
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    share: (
      <Share2
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    sparkles: (
      <Sparkles
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    globe: (
      <Globe
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    command: (
      <Command width={size} height={size} color={color} className={className} />
    ),
    send: (
      <SendHorizonal
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    user_edit: (
      <UserRoundPen
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    asterisk: (
      <Asterisk
        width={size}
        height={size}
        color={color}
        className={className}
      />
    ),
    languages: (
      <Languages
        width={size}
        height={size}
        color={color}
        className={className}
      />
    ),
    github: (
      <Github
        width={size}
        height={size}
        color={color}
        fill={full ? color : "none"}
        className={className}
      />
    ),
    apple: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_10678_10382)">
          <path
            d="M13.1393 9.03157C13.1632 11.6042 15.3962 12.4603 15.421 12.4712C15.4021 12.5316 15.0642 13.6912 14.2445 14.8891C13.5359 15.9247 12.8006 16.9565 11.6421 16.9779C10.5038 16.9988 10.1378 16.3029 8.83643 16.3029C7.53543 16.3029 7.12876 16.9565 6.05124 16.9989C4.93304 17.0412 4.08152 15.879 3.36711 14.8472C1.90723 12.7366 0.791587 8.88316 2.28962 6.28202C3.03381 4.99028 4.36373 4.1723 5.80725 4.15132C6.90529 4.13038 7.94167 4.89005 8.61295 4.89005C9.2838 4.89005 10.5432 3.97648 11.8673 4.11065C12.4216 4.13372 13.9775 4.33455 14.9765 5.79694C14.896 5.84685 13.12 6.88074 13.1393 9.03157ZM11.0001 2.71431C11.5937 1.99571 11.9933 0.995349 11.8843 0C11.0286 0.0343925 9.99381 0.570223 9.38003 1.28843C8.82996 1.92443 8.34822 2.94239 8.4782 3.91804C9.432 3.99184 10.4064 3.43336 11.0001 2.71431Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_10678_10382">
            <rect width={size} height={size} fill={color} />
          </clipPath>
        </defs>
      </svg>
    ),
    google: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_10678_10391)">
          <path
            d="M16.7975 8.65953C16.7975 7.96305 16.741 7.4548 16.6187 6.92773H8.66553V10.0713H13.3338C13.2398 10.8525 12.7315 12.029 11.6021 12.8196L11.5862 12.9248L14.1009 14.8729L14.2751 14.8903C15.8751 13.4126 16.7975 11.2384 16.7975 8.65953Z"
            fill={color}
          />
          <path
            d="M8.66541 16.9419C10.9525 16.9419 12.8725 16.1889 14.275 14.8901L11.6019 12.8194C10.8866 13.3183 9.92659 13.6665 8.66541 13.6665C6.42537 13.6665 4.52416 12.1889 3.84643 10.1465L3.74709 10.1549L1.13234 12.1785L1.09814 12.2736C2.49111 15.0407 5.35236 16.9419 8.66541 16.9419Z"
            fill={color}
          />
          <path
            d="M3.8464 10.146C3.66758 9.61892 3.56408 9.05416 3.56408 8.47064C3.56408 7.88706 3.66758 7.32236 3.83699 6.7953L3.83226 6.68304L1.18473 4.62695L1.09811 4.66816C0.524004 5.81643 0.19458 7.1059 0.19458 8.47064C0.19458 9.83538 0.524004 11.1248 1.09811 12.2731L3.8464 10.146Z"
            fill={color}
          />
          <path
            d="M8.66542 3.27536C10.256 3.27536 11.329 3.96243 11.9408 4.5366L14.3314 2.20241C12.8632 0.837672 10.9525 0 8.66542 0C5.35236 0 2.49111 1.90121 1.09814 4.66832L3.83703 6.79546C4.52416 4.75306 6.42537 3.27536 8.66542 3.27536Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_10678_10391">
            <rect width={size} height={size} fill={color} />
          </clipPath>
        </defs>
      </svg>
    ),
    logo_text: (
      <svg
        width={(size * 110) / 38}
        height={size}
        viewBox="0 0 110 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.069 31.0793C21.7404 31.0793 27.1486 25.6711 27.1486 18.9997C27.1486 12.3282 21.7404 6.91992 15.069 6.91992C8.39753 6.91992 2.98926 12.3282 2.98926 18.9997C2.98926 25.6711 8.39753 31.0793 15.069 31.0793Z"
          stroke={color}
          strokeWidth="0.805316"
          strokeLinecap="round"
          strokeDasharray="5.64 5.64"
        />
        <path
          d="M19.0955 19.0002C19.0955 16.7764 17.2928 14.9736 15.0689 14.9736C12.8451 14.9736 11.0424 16.7764 11.0424 19.0002C11.0424 21.224 12.8451 23.0269 15.0689 23.0269C17.2928 23.0269 19.0955 21.224 19.0955 19.0002Z"
          fill={color}
        />
        <path
          d="M34.6997 28.1727V9.72302H41.7721C42.6107 9.72302 43.3934 9.79756 44.1202 9.94665C44.847 10.0771 45.5085 10.2914 46.1049 10.5896C46.7014 10.8691 47.2137 11.2325 47.6424 11.6798C48.0711 12.1084 48.3972 12.6209 48.6208 13.2173C48.863 13.795 48.9842 14.4566 48.9842 15.202C48.9842 15.7611 48.891 16.3015 48.7047 16.8233C48.5184 17.3451 48.2201 17.8204 47.8101 18.249C47.4188 18.6776 46.8877 19.0317 46.2168 19.3112C45.5459 19.5908 44.7258 19.7678 43.7568 19.8424V20.066C44.875 20.1405 45.7509 20.3735 46.3845 20.7649C47.0368 21.1376 47.5306 21.6501 47.866 22.3023C48.2201 22.9359 48.4996 23.6627 48.7047 24.4827L49.6551 28.1727H45.7415L45.0427 24.7902C44.9123 24.1193 44.7072 23.5417 44.4277 23.0571C44.1667 22.5725 43.7848 22.1999 43.2816 21.9389C42.7784 21.6594 42.0981 21.5196 41.2409 21.5196H38.2499V28.1727H34.6997ZM38.2499 18.7242H41.3248C42.6293 18.7242 43.617 18.482 44.2879 17.9974C44.9588 17.5129 45.2943 16.7674 45.2943 15.7611C45.2943 14.7175 44.9774 13.9348 44.3438 13.413C43.7103 12.8911 42.7505 12.6302 41.4646 12.6302H38.2499V18.7242ZM50.7351 28.1727V21.1283V8.8844H54.2852V12.6582C54.2852 13.0123 54.2573 13.4968 54.2013 14.1118C54.164 14.7082 54.1081 15.3697 54.0336 16.0965C53.9592 16.8233 53.8753 17.5501 53.782 18.277C53.7076 18.9851 53.6423 19.6281 53.5864 20.2058H53.8379C54.0057 18.5658 54.3038 17.2333 54.7325 16.2084C55.1612 15.1647 55.7388 14.4007 56.4656 13.9161C57.211 13.4316 58.0964 13.1893 59.1213 13.1893C60.6867 13.1893 61.8514 13.7577 62.6155 14.8945C63.3982 16.0313 63.7896 17.7365 63.7896 20.0101V28.1727H60.2394V20.1778C60.2394 18.836 60.0531 17.867 59.6803 17.2706C59.3075 16.6556 58.7299 16.3481 57.9472 16.3481C57.2018 16.3481 56.5589 16.6183 56.0184 17.1588C55.4778 17.6806 55.0494 18.4726 54.7325 19.5349C54.4344 20.5971 54.2852 21.9204 54.2852 23.5044V28.1727H50.7351ZM72.119 28.564C70.8517 28.564 69.7615 28.3777 68.8484 28.0049C67.9539 27.6136 67.2177 27.0825 66.64 26.4116C66.0624 25.7221 65.6337 24.93 65.3541 24.0355C65.0932 23.1409 64.9628 22.1626 64.9628 21.1003C64.9628 20.0381 65.0932 19.0317 65.3541 18.0813C65.6337 17.1308 66.053 16.2922 66.6121 15.5654C67.1897 14.82 67.9073 14.2422 68.7645 13.8323C69.6405 13.4036 70.6748 13.1893 71.8674 13.1893C73.0041 13.1893 73.9919 13.385 74.8305 13.7764C75.6877 14.1677 76.3774 14.7268 76.8991 15.4536C77.4397 16.1618 77.8031 17.0097 77.9894 17.9974C78.1944 18.9665 78.2224 20.0381 78.0732 21.2121L67.1711 21.3798V19.2833L75.4176 19.1435L74.8305 20.3455C74.905 19.451 74.8399 18.6869 74.6349 18.0533C74.4486 17.4197 74.1223 16.9352 73.6565 16.5997C73.2092 16.2456 72.6128 16.0686 71.8674 16.0686C71.0661 16.0686 70.4044 16.2736 69.8827 16.6836C69.3795 17.0936 69.0067 17.662 68.7645 18.3888C68.5223 19.1156 68.4011 19.9728 68.4011 20.9605C68.4011 22.5819 68.718 23.8025 69.3516 24.6225C69.9851 25.4238 70.9264 25.8245 72.1749 25.8245C72.7713 25.8245 73.2651 25.7407 73.6565 25.5729C74.0478 25.4052 74.3553 25.1722 74.579 24.8741C74.8212 24.576 74.9797 24.2497 75.0542 23.8957C75.1474 23.5229 75.1846 23.1503 75.166 22.7775L78.4366 22.9732C78.474 23.6815 78.3807 24.3709 78.1571 25.0418C77.9334 25.6942 77.57 26.2904 77.0669 26.8309C76.5637 27.3526 75.9022 27.7719 75.0821 28.0888C74.2621 28.4057 73.2745 28.564 72.119 28.564ZM84.8217 28.4802C83.3122 28.4802 82.1661 28.0794 81.3834 27.2781C80.6192 26.4581 80.2372 25.2281 80.2372 23.5882V16.404H78.532V14.0279H78.9514C79.8459 13.9348 80.4794 13.6552 80.8522 13.1893C81.2436 12.7048 81.4766 11.9873 81.5511 11.0369L81.607 10.338H83.7595V13.5807H87.3376V16.4879H83.7595V23.3087C83.7595 24.0355 83.9272 24.5572 84.2626 24.8741C84.5981 25.191 85.0453 25.3493 85.6044 25.3493C85.884 25.3493 86.1821 25.312 86.4989 25.2375C86.8158 25.1442 87.0954 25.0139 87.3376 24.8461V28.0609C86.853 28.21 86.4057 28.3124 85.9958 28.3684C85.5859 28.4428 85.1945 28.4802 84.8217 28.4802ZM88.6138 28.1727V13.5807H92.164V28.1727H88.6138ZM90.3749 12.1271C89.6667 12.1271 89.1264 11.978 88.7536 11.6798C88.3996 11.3816 88.2225 10.953 88.2225 10.3939C88.2225 9.81621 88.4088 9.37825 88.7816 9.08008C89.1544 8.78191 89.6855 8.63281 90.3749 8.63281C91.0832 8.63281 91.6143 8.79121 91.9683 9.10803C92.3411 9.4062 92.5274 9.83484 92.5274 10.3939C92.5274 10.953 92.3411 11.3816 91.9683 11.6798C91.6143 11.978 91.0832 12.1271 90.3749 12.1271ZM100.69 28.564C99.4596 28.564 98.3879 28.3777 97.4748 28.0049C96.5803 27.6136 95.8349 27.0731 95.2385 26.3836C94.6609 25.6942 94.2228 24.8927 93.9247 23.9796C93.6451 23.0477 93.5054 22.0507 93.5054 20.9885C93.5054 19.9262 93.6451 18.9292 93.9247 17.9974C94.2228 17.047 94.6609 16.2084 95.2385 15.4815C95.8162 14.7547 96.543 14.1957 97.4189 13.8043C98.3134 13.3943 99.3663 13.1893 100.578 13.1893C102.031 13.1893 103.215 13.4689 104.128 14.0279C105.041 14.5684 105.693 15.2765 106.085 16.1524C106.495 17.0283 106.644 17.9788 106.532 19.0038L103.429 19.2833C103.448 18.5751 103.336 17.9788 103.094 17.4942C102.851 17.0097 102.507 16.6463 102.059 16.404C101.631 16.1618 101.127 16.0406 100.55 16.0406C100.065 16.0406 99.6087 16.1338 99.18 16.3202C98.7701 16.4879 98.4067 16.7674 98.0898 17.1588C97.7729 17.5315 97.5213 18.016 97.3351 18.6124C97.1673 19.2088 97.0835 19.9449 97.0835 20.8208C97.0835 21.9389 97.2326 22.8708 97.5307 23.6162C97.8476 24.3615 98.2761 24.9206 98.8166 25.2934C99.3757 25.6474 100.019 25.8245 100.745 25.8245C101.528 25.8245 102.143 25.6474 102.59 25.2934C103.038 24.9394 103.345 24.4827 103.513 23.9237C103.699 23.3646 103.764 22.7869 103.709 22.1905L107.007 22.3862C107.082 23.2248 107.007 24.0169 106.784 24.7623C106.56 25.5077 106.178 26.1694 105.637 26.747C105.116 27.3061 104.445 27.7534 103.625 28.0888C102.805 28.4057 101.826 28.564 100.69 28.564Z"
          fill={color}
        />
      </svg>
    ),
    logo: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 62 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30.4911 57.7467C45.2635 57.7467 57.2388 45.7714 57.2388 30.9991C57.2388 16.2264 45.2635 4.25098 30.4911 4.25098C15.7185 4.25098 3.74304 16.2264 3.74304 30.9991C3.74304 45.7714 15.7185 57.7467 30.4911 57.7467Z"
          stroke={color}
          strokeWidth="1.7832"
          strokeLinecap="round"
          strokeDasharray="12.49 12.49"
        />

        <path
          d="M39.407 31C39.407 26.0758 35.4151 22.084 30.4909 22.084C25.5668 22.084 21.575 26.0758 21.575 31C21.575 35.9241 25.5668 39.9162 30.4909 39.9162C35.4151 39.9162 39.407 35.9241 39.407 31Z"
          fill={color}
        />
      </svg>
    ),
  };

  return <span className={className}>{icons[name] || null}</span>;
};

export default Icon;
