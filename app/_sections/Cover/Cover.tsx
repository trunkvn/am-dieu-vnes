import styles from "./Cover.module.css";

/** The label every Vietnamese schoolchild has written on a notebook. */
export function Cover() {
  return (
    <div className={styles.cover}>
      <div />
      <div className={styles.body}>
        <div className={styles.label}>
          <b>Vở tập nói · Speaking notebook</b>
          <span lang="vi">Môn</span>: <span lang="vi">Thanh điệu</span>
          <br />
          <span lang="vi">Bài 1</span>: <u lang="vi">ma mà má mả mã mạ</u>
        </div>
        <div className={styles.date}>
          <span lang="vi">Ngày</span> <i /> <span lang="vi">tháng</span> <i />{" "}
          <span lang="vi">năm</span> <i />
        </div>
      </div>
    </div>
  );
}
