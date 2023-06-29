import { log } from "./log";

//使用fetch获取输入包名在npm上最新的版本号
export async function getLatestVersion(npmName: string): Promise<string> {
  //对包名进行url编码
  const encodedName = encodeURIComponent(npmName);
  //进行请求获取包相关信息
	const res = await fetch(`https://registry.npmjs.org/${encodedName}`);
	if (!res.ok) {
		log.error('error', `Failed to fetch latest version for ${npmName}`);
		throw new Error(`Failed to fetch latest version for ${npmName}`);
	}
	//请求成功把json数据进行解析
  const res_1 = await res.json();
	if (!res_1 || !res_1["dist-tags"] || !res_1["dist-tags"].latest) {
		log.error('error', `Failed to get latest version for ${npmName}`);
		throw new Error(`Failed to get latest version for ${npmName}`);
	}

  return res_1["dist-tags"].latest;
}
