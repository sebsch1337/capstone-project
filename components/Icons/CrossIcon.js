export default function CrossIcon({ modal, width = "10", height = "10" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.986432 14.4509C0.811189 14.2757 0.724027 14.0649 0.724946 13.8186C0.725865 13.5724 0.814601 13.361 0.991157 13.1844L6.15542 8.02015L1.10841 2.97315C0.93317 2.7979 0.846008 2.58715 0.846927 2.34089C0.847846 2.09463 0.936583 1.88323 1.11314 1.70667L2.51676 0.303049C2.71097 0.108838 2.92238 0.0201005 3.15098 0.036837C3.39724 0.0359181 3.60799 0.12308 3.78324 0.298324L8.83024 5.34533L13.8621 0.313484C14.0386 0.136928 14.2501 0.0481912 14.4963 0.0472729C14.7426 0.0463534 14.9533 0.133516 15.1286 0.308759L16.6532 1.83338C16.846 2.02614 16.9331 2.23689 16.9147 2.46563C16.9138 2.71189 16.825 2.9233 16.6485 3.09985L11.6166 8.1317L16.6636 13.1787C16.8389 13.354 16.926 13.5647 16.9251 13.811C16.9418 14.0396 16.8531 14.251 16.6589 14.4452L15.2553 15.8488C15.0787 16.0254 14.8673 16.1141 14.6211 16.115C14.3748 16.1159 14.164 16.0288 13.9888 15.8535L8.94179 10.8065L3.77753 15.9708C3.60097 16.1473 3.38956 16.2361 3.1433 16.237C2.91457 16.2554 2.70382 16.1683 2.51105 15.9755L0.986432 14.4509Z"
        fill={modal ? "#ffffff" : "#8e94a3"}
      />
    </svg>
  );
}
