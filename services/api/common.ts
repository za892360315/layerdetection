//智能检测
import { detectRequest, serverFileRequest } from "@/services/base";

export const api: any = {
  detecttUrl:
    "/xmgis/api/platform/detect-control-plan-categories/tree-by-id/" +
    (window as any).oneDetection.detectName,
  detecttUrlPL:
    "/xmgis/api/platform/detect-control-plan-categories/tree-by-id/" +
    (window as any).oneDetection.detecttNamePL,
  serverShapeFileUrl: "/api/services/app/Gis/ParseCADFileWithoutAE",
  serverZipFileUrl: "/api/services/app/Gis/ParseShapeFile",
  serverMdbFileUrl: "/api/services/app/Gis/ParseMDBFile",
};
// 获取一键检测指标数据
export async function getStatdetectData() {
  const result: any = await detectRequest.get(api.detecttUrl);
  return result;
}
// 获取批量检测指标数据
export async function getStatdetectPlData() {
  const result: any = await detectRequest.get(api.detecttUrlPL);
  return result;
}
// 文件解析 CAD
export async function parseCadFile(data: any) {
  const result: any = await serverFileRequest.post(
    api.serverShapeFileUrl,
    data
  );
  return result;
}
// 文件解析 shape
export async function parseShapeFile(data: any) {
  const result: any = await serverFileRequest.post(api.serverZipFileUrl, data);
  return result;
}
// 文件解析 MDB
export async function parseMdbFile(data: any) {
  const result: any = await serverFileRequest.post(api.serverMdbFileUrl, data);
  return result;
}
