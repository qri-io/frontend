import React from 'react'
import CustomIcon, { CustomIconProps } from '../CustomIcon'

const WebHook: React.FC<CustomIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12.2859 2C11.2274 2.00948 10.1984 2.35056 9.34386 2.9753C8.48928 3.60002 7.85204 4.47694 7.52182 5.4827C7.1916 6.48846 7.185 7.57244 7.50294 8.58216C7.82088 9.59186 8.44738 10.4765 9.2943 11.1116L6.7633 15.2574C6.5023 15.1763 6.22742 15.1498 5.95574 15.1794C5.68406 15.209 5.42136 15.2941 5.18396 15.4295C4.83952 15.6316 4.56254 15.931 4.38786 16.2902C4.21318 16.6493 4.1486 17.0521 4.20224 17.4478C4.2559 17.8435 4.42538 18.2146 4.68936 18.5142C4.95334 18.8139 5.30006 19.0288 5.68586 19.1319C6.07168 19.2351 6.47938 19.2218 6.85768 19.0938C7.23596 18.9658 7.56796 18.7288 7.81188 18.4126C8.05582 18.0964 8.2008 17.7151 8.22858 17.3167C8.25636 16.9183 8.16572 16.5206 7.96804 16.1736C7.8801 16.0281 7.77282 15.8953 7.64914 15.7787L10.4029 11.2533L10.6712 10.8129L10.2308 10.5598C9.61984 10.2 9.11412 9.6861 8.76412 9.0695C8.41414 8.4529 8.23216 7.75524 8.23642 7.04624C8.24066 6.33726 8.43098 5.6418 8.78832 5.02944C9.14566 4.41708 9.65752 3.90928 10.2727 3.5568C10.8879 3.20432 11.5848 3.01952 12.2938 3.0209C13.0028 3.02228 13.699 3.20978 14.3128 3.56466C14.9266 3.91952 15.4365 4.42932 15.7915 5.04306C16.1464 5.6568 16.334 6.353 16.3355 7.062C16.3384 7.46326 16.2803 7.86264 16.1634 8.2465L17.1252 8.55022C17.3581 7.79304 17.41 6.99178 17.2768 6.21088C17.1436 5.42998 16.829 4.69124 16.3583 4.05408C15.8876 3.41692 15.2739 2.89914 14.5666 2.54238C13.8593 2.18562 13.0781 1.99985 12.2859 2ZM12.2859 5.0372C11.7489 5.0372 11.2339 5.25052 10.8542 5.63024C10.4745 6.00996 10.2611 6.52498 10.2611 7.062C10.2611 7.599 10.4745 8.11402 10.8542 8.49374C11.2339 8.87346 11.7489 9.08678 12.2859 9.08678C12.4564 9.0858 12.6262 9.06542 12.7921 9.02604L15.2269 13.435L15.4649 13.8805L15.9255 13.6426C16.5153 13.3137 17.1788 13.1396 17.8541 13.1364C18.5173 13.1362 19.1703 13.2989 19.7559 13.6102C20.3414 13.9214 20.8416 14.3717 21.2124 14.9215C21.5834 15.4713 21.8134 16.1037 21.8826 16.7633C21.952 17.4228 21.858 18.0893 21.6094 18.7041C21.3608 19.3189 20.965 19.8632 20.457 20.2892C19.9487 20.7154 19.3437 21.01 18.6949 21.1476C18.0462 21.285 17.3736 21.2612 16.7362 21.078C16.0989 20.8946 15.5163 20.5576 15.0397 20.0966L14.3411 20.8256C14.9372 21.4018 15.6656 21.8226 16.4625 22.0514C17.2593 22.2802 18.1002 22.3098 18.9111 22.1374C19.7221 21.9652 20.4782 21.5964 21.1134 21.0634C21.7484 20.5306 22.2428 19.8498 22.5532 19.081C22.8634 18.3123 22.9802 17.479 22.8932 16.6546C22.8062 15.8301 22.518 15.0397 22.054 14.3527C21.59 13.6657 20.9644 13.1032 20.232 12.7145C19.4997 12.3259 18.6832 12.1231 17.8541 12.124C17.1758 12.1359 16.5072 12.2875 15.8901 12.5694L13.6628 8.51984C13.9517 8.24142 14.1515 7.8834 14.2366 7.49126C14.3217 7.09912 14.2883 6.69052 14.1408 6.31736C13.9933 5.9442 13.7382 5.62328 13.4079 5.39536C13.0777 5.16742 12.6872 5.04276 12.2859 5.0372ZM12.2859 6.0496C12.4862 6.0496 12.6819 6.10896 12.8484 6.22022C13.0149 6.33146 13.1446 6.48958 13.2213 6.67456C13.2979 6.85956 13.3179 7.06312 13.2789 7.2595C13.2398 7.45588 13.1434 7.63628 13.0018 7.77786C12.8602 7.91946 12.6798 8.01588 12.4834 8.05494C12.2871 8.094 12.0835 8.07396 11.8985 7.99732C11.7135 7.9207 11.5554 7.79094 11.4441 7.62446C11.3329 7.45796 11.2735 7.26222 11.2735 7.062C11.2735 6.79348 11.3802 6.53598 11.5701 6.34612C11.7599 6.15626 12.0174 6.0496 12.2859 6.0496ZM4.97642 12.2657C4.07138 12.4795 3.24272 12.9385 2.58138 13.5923C1.92004 14.246 1.45158 15.0694 1.22741 15.9719C1.00323 16.8744 1.03201 17.8212 1.31057 18.7085C1.58914 19.5957 2.10674 20.389 2.80656 21.0014C3.50638 21.6138 4.36136 22.0216 5.27772 22.1802C6.19406 22.3386 7.13634 22.2414 8.00116 21.8996C8.86598 21.5578 9.6199 20.9842 10.1802 20.242C10.7405 19.4998 11.0855 18.6176 11.1774 17.6922H15.9103C16.0335 18.1693 16.3265 18.5852 16.7344 18.8618C17.1423 19.1384 17.6371 19.2567 18.1259 19.1946C18.6148 19.1325 19.0643 18.8943 19.3901 18.5245C19.7159 18.1547 19.8956 17.6788 19.8956 17.186C19.8956 16.6932 19.7159 16.2172 19.3901 15.8475C19.0643 15.4777 18.6148 15.2394 18.1259 15.1773C17.6371 15.1152 17.1423 15.2336 16.7344 15.5102C16.3265 15.7867 16.0335 16.2026 15.9103 16.6798H10.2611V17.186C10.2622 17.945 10.0499 18.689 9.64858 19.3331C9.24722 19.9773 8.6729 20.4958 7.99114 20.8292C7.30936 21.1628 6.54758 21.298 5.79268 21.2196C5.03776 21.141 4.3201 20.852 3.72156 20.3852C3.123 19.9186 2.66764 19.2931 2.40742 18.5801C2.14718 17.8671 2.09256 17.0954 2.24976 16.3529C2.40698 15.6103 2.7697 14.9269 3.29654 14.3806C3.8234 13.8343 4.49318 13.447 5.22952 13.2629L4.97642 12.2657ZM6.08498 16.1736C6.33282 16.1346 6.58628 16.1891 6.79624 16.3264C7.0062 16.4638 7.1577 16.6741 7.22136 16.9168C7.28502 17.1595 7.2563 17.4171 7.1408 17.6398C7.0253 17.8625 6.8312 18.0344 6.59618 18.1222C6.36114 18.2099 6.10192 18.2073 5.86872 18.1147C5.63552 18.0222 5.445 17.8464 5.33406 17.6214C5.22312 17.3964 5.19968 17.1382 5.26828 16.8969C5.33688 16.6556 5.49262 16.4483 5.70534 16.3153C5.82104 16.243 5.95018 16.1948 6.08498 16.1736ZM17.8541 16.1736C18.0544 16.1736 18.2501 16.233 18.4166 16.3442C18.5831 16.4554 18.7128 16.6136 18.7895 16.7985C18.8661 16.9835 18.8861 17.1871 18.8471 17.3835C18.808 17.5799 18.7116 17.7603 18.57 17.9018C18.4284 18.0434 18.248 18.1399 18.0516 18.1789C17.8552 18.218 17.6517 18.1979 17.4667 18.1213C17.2817 18.0447 17.1236 17.9149 17.0123 17.7484C16.9011 17.5819 16.8417 17.3862 16.8417 17.186C16.8417 16.9175 16.9484 16.66 17.1382 16.4701C17.3281 16.2802 17.5856 16.1736 17.8541 16.1736Z" fill="black" stroke="currentColor" strokeWidth="0.6"/>
  </CustomIcon>
)

export default WebHook
