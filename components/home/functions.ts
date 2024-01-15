import { FileWithPath } from "@mantine/dropzone";
import { FormValues } from "./ModalSoggetto";
import { ApiResponse, Sesso } from "@/types/types";
import { apiFetch } from "@/lib/apiFetch";
import { Soggetto } from "@prisma/client";

interface AggiungiParams {
  form: FormValues;
  avatarFile: FileWithPath;
  covataId?: number;
}
export const aggiungiSoggetto = async ({
  form,
  avatarFile,
  covataId,
}: AggiungiParams) => {
  let sesso = null;
  if (form.sesso == Sesso.Maschio) {
    sesso = true;
  } else if (form.sesso == Sesso.Femmina) {
    sesso = false;
  }
  const formData = new FormData();

  formData.append(
    "form",
    JSON.stringify({ ...form, sesso: sesso, covataId: covataId })
  );
  if (avatarFile) {
    formData.append("imgFile", avatarFile);
  }

  const result = await apiFetch.postFormData("/api/soggetti", formData);

  return result;
};

interface ModificaParams {
  form: FormValues;
  avatarFile: FileWithPath;
  id: string;
}
export const modificaSoggetto = async ({
  form,
  avatarFile,
  id,
}: ModificaParams) => {
  let sesso = null;
  if (form.sesso == Sesso.Maschio) {
    sesso = true;
  } else if (form.sesso == Sesso.Femmina) {
    sesso = false;
  }

  const formData = new FormData();
  formData.append("form", JSON.stringify({ ...form, sesso: sesso }));
  if (avatarFile) {
    formData.append("imgFile", avatarFile);
  }
  const result = await apiFetch.patchFormData(`/api/soggetti/${id}`, formData);

  return result;
};

export const togglePreferitoSoggetto = async (id: string) => {
  return await apiFetch.put<Soggetto>(`/api/soggetti/${id}`);
};
