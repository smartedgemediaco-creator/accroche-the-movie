import { NextRequest, NextResponse } from "next/server"

interface B2AuthorizeResponse {
  apiUrl: string
  authorizationToken: string
  downloadUrl: string
  accountId: string
}

interface B2DownloadAuthResponse {
  authorizationToken: string
}

interface B2Bucket {
  bucketName: string
  bucketId: string
}

interface B2ListBucketsResponse {
  buckets: B2Bucket[]
}

async function authorizeB2(): Promise<B2AuthorizeResponse> {
  const keyId = process.env.B2_KEY_ID
  const applicationKey = process.env.B2_APPLICATION_KEY

  if (!keyId || !applicationKey) {
    throw new Error("Missing B2_KEY_ID or B2_APPLICATION_KEY")
  }

  const credential = Buffer.from(`${keyId}:${applicationKey}`).toString("base64")

  const response = await fetch("https://api005.backblazeb2.com/b2api/v1/b2_authorize_account", {
    method: "GET",
    headers: {
      Authorization: `Basic ${credential}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`B2 authorization failed: ${response.status} ${errorText}`)
  }

  return (await response.json()) as B2AuthorizeResponse
}

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("file")
  const bucketName = process.env.B2_BUCKET_NAME

  if (!fileName || !bucketName) {
    return NextResponse.json(
      { error: "Missing file or B2_BUCKET_NAME configuration" },
      { status: 500 },
    )
  }

  try {
    const auth = await authorizeB2()
    let bucketId = process.env.B2_BUCKET_ID

    if (!bucketId) {
      const listBucketsResponse = await fetch(`${auth.apiUrl}/b2api/v1/b2_list_buckets`, {
        method: "POST",
        headers: {
          Authorization: auth.authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: auth.accountId,
        }),
      })

      if (!listBucketsResponse.ok) {
        const errorText = await listBucketsResponse.text()
        throw new Error(`B2 bucket lookup failed: ${listBucketsResponse.status} ${errorText}`)
      }

      const bucketsData = (await listBucketsResponse.json()) as B2ListBucketsResponse
      const bucket = bucketsData.buckets.find((item) => item.bucketName === bucketName)

      if (!bucket) {
        throw new Error(`Bucket ${bucketName} was not found in your B2 account`)
      }

      bucketId = bucket.bucketId
    }

    const authResponse = await fetch(`${auth.apiUrl}/b2api/v1/b2_get_download_authorization`, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId,
        fileNamePrefix: fileName,
        validDurationInSeconds: 1800,
      }),
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      throw new Error(`B2 download authorization failed: ${authResponse.status} ${errorText}`)
    }

    const authData = (await authResponse.json()) as B2DownloadAuthResponse
    const signedUrl = new URL(`${auth.downloadUrl}/file/${bucketName}/${encodeURIComponent(fileName)}`)
    signedUrl.searchParams.set("Authorization", authData.authorizationToken)

    return NextResponse.redirect(signedUrl.toString(), 307)
  } catch (error) {
    console.error("Backblaze signed URL error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create signed URL",
      },
      { status: 500 },
    )
  }
}
