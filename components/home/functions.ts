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

  const result = await fetch("/api/soggetti", {
    method: "POST",
    body: formData,
  });
  const res: ApiResponse<Soggetto> = await result.json();
  return res;
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

  const values = new FormData();
  values.append("form", JSON.stringify({ ...form, sesso: sesso }));
  if (avatarFile) {
    values.append("imgFile", avatarFile);
  }
  const response = await fetch(`/api/soggetti/${id}`, {
    method: "PATCH",
    body: values,
  });
  const res: ApiResponse<Soggetto> = await response.json();
  return res;
};

export const togglePreferitoSoggetto = async (id: string) => {
  return await apiFetch.put<Soggetto>(`/api/soggetti/${id}`);
};
