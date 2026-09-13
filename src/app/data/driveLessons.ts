type DriveLesson = {
  module: string;
  topics: string[];
  videoUrl: string;
  resources: never[];
};

const lesson = (title: string, fileId: string, topic: string): DriveLesson => ({
  module: title,
  topics: [topic],
  videoUrl: `https://drive.google.com/file/d/${fileId}/view`,
  resources: [],
});

const sessions = (topic: string, items: [number, string][]) =>
  items.map(([number, id]) => lesson(`Session ${String(number).padStart(2, "0")} · ${topic}`, id, topic));

const gcp = [
  ...sessions("Course demos", [[1,"1cuib3k0FdBJ1y8Mn5XXlvP1lQxfPXxAQ"],[2,"1sPn1QxL0hvUmOzJVVM7WUzpxWGVpSIlz"]]),
  ...sessions("Cloud basics", [[3,"19BTEISLj7YtbaNpDoSWfXm3HAR7IQq5c"],[4,"1IpO-g7lchel_0w5kQCi9y4KTo2g7FRdu"],[5,"1HCcZa1CiZuvJYlJ5JbTT16z8P3pDYBbc"],[6,"1CV_uyuV6amPCX-83JEKzaAcAQ1vJMwYL"],[7,"1b9B9MOcHDHQkB232r8icFFF-iDTpqgGf"],[8,"1AqRmlk8z2Ni1mWYlh7wVRYJK4DpjwGob"]]),
  ...sessions("Cloud Storage", [[9,"1oJwfnERS283ALEgaCKP8PBLXUiY_tjeD"],[10,"1Rc0UtLH_xOUnh7OFe6l7hy8HL02v15i0"]]),
  ...sessions("Cloud SQL", [[11,"1wvZ5CSU0O-2lKHl93kokHBY9X2G1vV_x"],[12,"1V2J3sGXHJf4ZckUCu1ZfI6Dd_eTuiNFB"],[13,"1VKS3ItWCyq13_n8rLphTOnqAq1RNxAbQ"]]),
  ...sessions("BigQuery", [[14,"1As5oNvb_wXzAjlm3GdUf5YIrOvS-LhhB"],[15,"1G0jOyAoShDEHbaV3q13mfrFp6bBI2oED"],[16,"1D7m0iNi1ekTRd4APhp9L_pFo5PHYPGSS"],[17,"1UeAgC5nKUfK6Sdt7tsVSfRlydN9WpqVL"],[18,"1m0EKyymf93jHkBXXQ2Ou-aGgVSV54lXO"],[19,"1mYhxD-37R4KWz2wH9FDd65x78t_984oN"],[20,"1c4epDBw-5UkCpjZHnKhbT6GByF32XMm-"]]),
  ...sessions("Python for data engineers", [[21,"120VeIDT8odqpw7zMF8T3NeCFdycfnnE-"],[22,"1L0EvW5_v-GIewUsq2wH6yF5ejBsxo789"],[23,"1HEozF2fvC1zrnIvuCavwoRMxuWy1q0oN"],[24,"1-WM58LpApktW_WMyXqDYZ4Kg0UAlM1VH"],[25,"1v-NB4r7rPrKae6KViwT9Sx4jmS7YwhMu"],[26,"13erGKycZ7ijspbZhdr-fuP1utn6BRnKY"]]),
  ...sessions("Dataproc", [[27,"1KTd1K_KZ8buZPLsVUkZYPES5XDb6rF_1"],[28,"1naUi1w7W4Yt92dYu0JTjAhSLrwMbHCSm"],[29,"1-flLVPgnmCPVRTiUuVY00J7YlafEuxxO"],[30,"1F0RKGqHVnnTQosALvJcn8LzGuUp4D2Fh"],[31,"1W5FBtHKlRzfpQ22BD49VuW6G7pgHwRbG"],[32,"1rHBRqIPWXQ8cKquyFs2t1Tl91Tc2EFRE"],[33,"1o5wDGr3AdNfhZk9RfhyhljeU585hhfNO"],[34,"15lk3BgeAHn2XdwlRFqjJSYj1G4HD8QW8"]]),
  ...sessions("Dataflow and Pub/Sub", [[35,"1T140gCFqh93-uXOx1czflf6FvSSeURLt"],[36,"1-K3pnPeDBZfCIFwn5kVTypNULTDgINI-"],[37,"1oU5ChYL-8dexyyJtTmbK5HfDB8Gi00LQ"],[38,"1vzQV1zXTa6ShaW-_7nKyblLbOvWOSA-_"],[39,"1RHf1GoBD6YUjhgT654_G5S1FEv_B8TOM"],[40,"1wWjA9zn1WVIMLLYhIW1SXrMUSHAl9z_Z"],[41,"1-nUpLIpbGO10-NzWO_xfXVjV1jC3NOu5"]]),
  ...sessions("Airflow and Cloud Composer", [[42,"1EaUvJCv4Ac72FnIpRJnIaQjDjKKCllgo"],[43,"1xik1lox9D1tiHZJmZ_Y5ETRWAIhyIsUI"],[44,"1FTdoZiW4Q8ReeABV8ERzRxAvZ5KGYe7j"],[45,"1C1V9MIc-9VBZQvCm5QlISozNsnRD1t0E"]]),
  ...sessions("Cloud Functions", [[46,"1pEJjAyWk7Z22rEfAO39XfdKJrtm629JN"]]),
  ...sessions("Databricks", [[47,"1VBWpZGE9CJZPQPDJ4b9B4RS-84R29STr"],[48,"1VNgQQ4JS3-mfzCakP172afK5Nuh5RO4a"],[49,"1n6c8NbTSI-RRJ8cVCN7mBCj71XR63RJU"],[50,"1fsb02Y-0MFjo4KQqEzGKhel2_6pgy1Cz"],[51,"1u3qlBHE8vSuLDoQDxhaJx03P7eDqBjlj"],[52,"1IwYiiTBVIcZQqcsMUMRrQj2GMc1vzT5w"],[53,"1co3pIuRDF9p_I08QyQkdw-n-zPERPUXj"],[54,"1n7GKJmpzNIWPT0Jffti3UdOFQYwjAOrt"],[55,"1NLz4eELQ3mSKgJ7Wa_nXF_y9U7oQFNSu"]]),
];

const python = sessions("Python for data engineers", [[21,"120VeIDT8odqpw7zMF8T3NeCFdycfnnE-"],[22,"1L0EvW5_v-GIewUsq2wH6yF5ejBsxo789"],[23,"1HEozF2fvC1zrnIvuCavwoRMxuWy1q0oN"],[24,"1-WM58LpApktW_WMyXqDYZ4Kg0UAlM1VH"],[25,"1v-NB4r7rPrKae6KViwT9Sx4jmS7YwhMu"],[26,"13erGKycZ7ijspbZhdr-fuP1utn6BRnKY"]]);

const namedSessions = (topic: string, items: [string, string][]) =>
  items.map(([title, id]) => lesson(title, id, topic));

const healthcare = namedSessions("Healthcare data engineering project", [
  ["Session 01 · Healthcare project introduction","1IZtzYfK0d-OOeCniSMAINOQy4CCAH5nK"],["Session 02 · Healthcare pipeline","1udmDJJ50G5zBs_EtnFuZqUT22TROz0bt"],["Session 03 · Healthcare pipeline","18OD463m6PUrmY8KVBeegnsnsOelYQyox"],["Session 04 · Healthcare pipeline","1rK1-LZ0RNohFC9t58yhJ5BYb8vO6lfeh"],["Session 05 · Healthcare pipeline","1oKp4IivNUCgOG_49BQYZY92AXdq4ndy8"],["Session 06 · Healthcare pipeline","1UA9SfAuYaEncntuYlrzt0cWGD5P0l79I"],["Session 07 · Healthcare pipeline","1kZFuSdG3TarB6pheDELcTWhvbiuR1DxP"],["Session 08 · Healthcare project completion","1KtuSLiTuQqjc6ne5PBVkd-0-WtcK96uJ"],
]);

const retailer = namedSessions("Retailer data engineering project", [
  ["Introduction · Retailer project","1EpRxaOqfpuFO0kZ-X1lAlYACX4GGr7LH"],["Session 01 · Retailer pipeline","1OhylI0cbluyBHQOndBOxEXskVcwipaeo"],["Session 02 · Retailer pipeline","1WaRGxZBNqfgZ08JNknyA85JqwWGMvcOH"],["Session 03 · Retailer pipeline","12T5-DWZbxgjAXTYjdfpw0StPo4z7CcoM"],["Session 04 · Retailer pipeline","1DASJT-TehLfAj3Ti44o48auFR9Gyuoy9"],["Session 05 · Retailer pipeline","1pFFlz3bu7bPWmdr38AYmXenrxFKQThHi"],["Session 06 · Retailer pipeline","1NZ8aPEsyIkoWS4zHV2RCygcGsySOke4h"],["Session 07 · Retailer pipeline","10EeoMF6jDKRBWI3BZ7wIo-KHZ1yt1K7d"],["Session 08 · Retailer pipeline","1SytWabYdRzLpI0ruFLzdT6q32_m_7J-G"],["Session 09 · Retailer pipeline","1dgzZ_MIyncIZC5EVb6sMcuSSo6g-s3EN"],["Session 10 · Retailer pipeline","1UiWhVJUWUXgU3KXymt1OSda_Dgd1dR1a"],["Session 11 · Retailer project completion","1HkBYGPZ5ra8MFG2c5vyMX1qz0qh8ef9C"],
]);

const traffic = namedSessions("Traffic GCP and Databricks project", [
  ["00 · Course material and access","1DXG3RV_ZH7ie_m-4ms8v5s5CF17dBsiB"],["01 · Project introduction","1wzU_XET1mE3hkgqDBIF6xRiosPq-TDeU"],["02 · Project architecture","1yOLBsKNP3kZXBD5T9flSHiY1WP9w4Gra"],["03 · Understanding the datasets","1yZ3MEJACT3u46oErhcfq_GGwx2TGhC2d"],["04 · GCP and Databricks free accounts","1nFSbwLbk-rZgzf8LenTqcJ7wwbkHI4A8"],["05 · Workspace and metastore setup","1B5kjelCd97Y0JcwpQVk6TNqr4m0CkEJT"],["06 · Development environment setup","1Ar2drGXasAuROHm8qbAlSA3o3VJJkHKr"],["07 · Create schemas dynamically","1OkS8Dcd-Dp9CSWpvkrRv4OuxeqQjBVda"],["08 · Create Bronze tables","1dJmKbbnPCGpS8AZ3uz_d_hxzA79BvJy7"],["09 · Load Bronze tables","1zp-7byFlQOTof_16DmVssEMzZf2Th6k8"],["10 · Silver transformations","1haU8DI9o8eySScEOvHMyr1TM3JS9biqJ"],["11 · Gold transformations","193FcWst_m_f0_4pEA7wmS3ARbhdemsNZ"],["12 · Workflow orchestration","1R459I14kkFEQUdl7kf9UUsF8eyuLDMSs"],["13 · GitHub and development pipelines","1mIV4saGgPNkChIxhEMWWfrDXaaqRmFqB"],["14 · UAT environment setup","1D_SH_wSV7gRhyzeIijRsxp2lamqqzat3"],["15 · Git, pull requests, and UAT","1LB9pabDkbhVV_S6jV8PHXrhU_kzqaAA5"],["16 · UAT workflow orchestration","11IE85N2taDB8MYNoBLxoGrJjYnU9VQ95"],["17 · Production setup and project closure","1-7GYD-w8CBIxQ3sFXUVcJx9HVYr_-FOp"],
]);

export const SELF_PACED_DRIVE_LESSONS: Record<string, DriveLesson[]> = {
  "gcp-recordings": gcp,
  "python-de": python,
  "project-healthcare": healthcare,
  "project-retail": retailer,
  "project-traffic": traffic,
};
