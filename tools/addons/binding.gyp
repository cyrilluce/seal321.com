{
  "targets": [
    {
      "target_name": "SealUtil",
      "sources": [ "addon.cc", "alg.cc"],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
