from typing import Annotated, Any

import orjson
import uvicorn
from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Response
from fastapi.responses import (
    FileResponse,
    HTMLResponse,
    ORJSONResponse,
    PlainTextResponse,
    RedirectResponse,
    StreamingResponse,
    UJSONResponse,
)

# from fastapi.testclient import TestClient

app = FastAPI()

# custom response ------------------------------------------------#


@app.get("/ujsonresponse/", response_class=UJSONResponse)
async def ujsonresponse():
    return [{"item_id": "Foo"}]


@app.get("/orjsonresponse/", response_class=ORJSONResponse)
async def orjsonresponse():
    return ORJSONResponse([{"item_id": "Foo"}])


@app.get("/htmlresponse1/", response_class=HTMLResponse)
async def htmlresponse1():
    return """
    <html>
        <head>
            <title>Some HTML in here</title>
        </head>
        <body>
            <h1>Look ma! HTML!</h1>
        </body>
    </html>
    """


@app.get("/htmlresponse2/")
async def htmlresponse2():
    html_content = """
    <html>
        <head>
            <title>Some HTML in here</title>
        </head>
        <body>
            <h1>Look ma! HTML!</h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


def generate_html_response():
    html_content = """
    <html>
        <head>
            <title>Some HTML in here</title>
        </head>
        <body>
            <h1>Look ma! HTML!</h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/htmlresponse3/", response_class=HTMLResponse)
async def htmlresponse3():
    return generate_html_response()


@app.get("/plaintextresponse", response_class=PlainTextResponse)
async def plaintextresponse():
    return "Hello World"


@app.get("/redirectresponse1")
async def redirectresponse1():
    return RedirectResponse("https://typer.tiangolo.com")


@app.get("/redirectresponse2", response_class=RedirectResponse)
async def redirectresponse2():
    return "https://fastapi.tiangolo.com"


@app.get("/redirectresponse3", response_class=RedirectResponse, status_code=302)
async def redirectresponse3():
    return "https://docs.pydantic.dev/"


async def fake_video_streamer():
    for i in range(10):
        yield b"some fake video bytes"


@app.get("/streamingresponse1")
async def streamingresponse1():
    return StreamingResponse(fake_video_streamer())


file_path = "fastapi_tutorial.py"


@app.get("/streamingresponse2")
def streamingresponse2():
    def iterfile():  # (1)
        with open(file_path, mode="rb") as file_like:  # (2)
            yield from file_like  # (3)

    return StreamingResponse(iterfile(), media_type="video/mp4")


@app.get("/fileresponse1")
async def fileresponse1():
    return FileResponse(file_path)


@app.get("/fileresponse2", response_class=FileResponse)
async def fileresponse2():
    return file_path


class CustomORJSONResponse(Response):
    media_type = "application/json"

    def render(self, content: Any) -> bytes:
        assert orjson is not None, "orjson must be installed"
        return orjson.dumps(content, option=orjson.OPT_INDENT_2)


@app.get("/customorjsonresponse", response_class=CustomORJSONResponse)
async def customorjsonresponse():
    return {"message": "Hello World"}


@app.get("/items/")
async def read_items():
    return [{"item_id": "Foo"}]


# dataclass ------------------------------------------------#

# openapi ------------------------------------------------#


# dependencies ------------------------------------------------#


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


CommonsDep = Annotated[dict, Depends(common_parameters)]


@app.get("/common_parameters1/")
async def common_parameters1(commons: CommonsDep):
    return commons


@app.get("/common_parameters2/")
async def common_parameters2(commons: Annotated[dict, Depends(common_parameters)]):
    return commons


@app.get("/common_parameters3/")
async def common_parameters3(commons: dict = Depends(common_parameters)):
    return commons


fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit


@app.get("/common_parameters4/")
async def common_parameters4(
    commons: Annotated[CommonQueryParams, Depends(CommonQueryParams)],
):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response


@app.get("/common_parameters5/")
async def common_parameters5(commons: CommonQueryParams = Depends(CommonQueryParams)):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response


@app.get("/common_parameters6/")
async def common_parameters6(commons: Annotated[Any, Depends(CommonQueryParams)]):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response


@app.get("/common_parameters7/")
async def common_parameters7(commons=Depends(CommonQueryParams)):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response


@app.get("/common_parameters8/")
async def common_parameters8(commons: Annotated[CommonQueryParams, Depends()]):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response


@app.get("/common_parameters9/")
async def common_parameters9(commons: CommonQueryParams = Depends()):
    response = {}
    if commons.q:
        response.update({"q": commons.q})
    items = fake_items_db[commons.skip : commons.skip + commons.limit]
    response.update({"items": items})
    return response


def query_extractor(q: str | None = None):
    return q


def query_or_cookie_extractor(
    q: Annotated[str, Depends(query_extractor)],
    # q: str = Depends(query_extractor),
    last_query: Annotated[str | None, Cookie()] = None,
    # last_query: str | None = Cookie(default=None)
):
    if not q:
        return last_query
    return q


@app.get("/query_extractor/")
async def query_extractor(
    query_or_default: Annotated[str, Depends(query_or_cookie_extractor)],
):
    return {"q_or_cookie": query_or_default}


async def verify_token(x_token: Annotated[str, Header()]):  # str = Header()
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def verify_key(x_key: Annotated[str, Header()]):  # str = Header()
    if x_key != "fake-super-secret-key":
        raise HTTPException(status_code=400, detail="X-Key header invalid")
    return x_key


class FixedContentQueryChecker:
    def __init__(self, fixed_content: str):
        self.fixed_content = fixed_content

    def __call__(self, q: str = ""):
        if q:
            return self.fixed_content in q
        return False


checker = FixedContentQueryChecker("bar")


# NOTE: bool = Depends(checker) 等效于 Annotated[bool, Depends(checker)]
@app.get("/query-checker/")
async def read_query_check(fixed_content_included: bool = Depends(checker)):
    return {"fixed_content_in_query": fixed_content_included}


# app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)])


@app.get("/verify_headers/", dependencies=[Depends(verify_token), Depends(verify_key)])
async def verify_headers():
    return [{"item": "Foo"}, {"item": "Bar"}]


async def override_dependency(q: str | None = None):
    return {"q": q, "skip": 5, "limit": 10}


# dependencies testing ------------------------------------------------#

# client = TestClient(app)

# app.dependency_overrides[common_parameters] = override_dependency


# def test_override_in_items():
#     response = client.get("/common_parameters1/")
#     assert response.status_code == 200
#     assert response.json() == {
#         "message": "Hello Items!",
#         "params": {"q": None, "skip": 5, "limit": 10},
#     }


# def test_override_in_items_with_q():
#     response = client.get("/common_parameters1/?q=foo")
#     assert response.status_code == 200
#     assert response.json() == {
#         "message": "Hello Items!",
#         "params": {"q": "foo", "skip": 5, "limit": 10},
#     }


# def test_override_in_items_with_params():
#     response = client.get("/common_parameters1/?q=foo&skip=100&limit=200")
#     assert response.status_code == 200
#     assert response.json() == {
#         "message": "Hello Items!",
#         "params": {"q": "foo", "skip": 5, "limit": 10},
#     }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
